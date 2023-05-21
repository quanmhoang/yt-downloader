resource "aws_security_group" "ecs_sg" {
  name = "${var.application}-ecs-${var.stage}"
  description = "Allow inbound from VPC"
  vpc_id      = data.aws_vpc.myria_vpc.id

  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = [data.aws_vpc.myria_vpc.cidr_block]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = [data.aws_vpc.myria_vpc.cidr_block]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = local.common_tags
}

resource "aws_ecs_cluster" "ecs_cluster" {
  name = "${var.application}-cluster-${var.stage}"

  setting {
    name = "containerInsights"
    value = "enabled"
  }
}

resource "aws_ecs_service" "ecs_service" {
  name             = "${var.application}-${var.stage}"
  cluster          = aws_ecs_cluster.ecs_cluster.id
  task_definition  = aws_ecs_task_definition.ecs_task_definition.arn
  desired_count    = 2
  launch_type      = "FARGATE"
  platform_version = "1.4.0"
  propagate_tags   = "SERVICE"

  network_configuration {
    security_groups  = [aws_security_group.ecs_sg.id]
    subnets          = data.aws_subnets.private_subnets.ids
    assign_public_ip = false
  }

  load_balancer {
    // aws_lb_target_group.alb_blue_green_tg[0].arn -> prod brand new Target Group
    // data.aws_lb_target_group.alb_node_tg.arn -> dev & staging existing Target Group
    target_group_arn = local.trimmed_stage == "prod" ? aws_lb_target_group.alb_blue_green_tg[0].arn : data.aws_lb_target_group.alb_node_tg.arn
    container_name   = "${var.application}-container-${var.stage}"
    container_port   = 8080
  }

  tags = local.common_tags
}

resource "aws_ecs_task_definition" "ecs_task_definition" {
  family                   = "${var.application}-task-definition-${var.stage}"
  network_mode             = "awsvpc"
  execution_role_arn       = aws_iam_role.ecs_task_iam_role.arn
  task_role_arn            = aws_iam_role.ecs_task_iam_role.arn
  requires_compatibilities = ["FARGATE"]
  cpu                      = local.trimmed_stage == "prod" ? "1024" : "256"
  memory                   = local.trimmed_stage == "prod" ? "4096" : "512"
  container_definitions    = data.template_file.ecs_task_template.rendered

  tags = local.common_tags
}

data "template_file" "ecs_task_template" {
  template  = file("./ecs_task_definition.json.tpl")

  vars = {
    service_name              = "${var.application}-container-${var.stage}" # Needs to be same as aws_ecs_service.load_balancer.container_name
    ecr_repo                  = "${data.aws_caller_identity.current.account_id}.dkr.ecr.${var.region}.amazonaws.com/myriaverse-services-node-${local.trimmed_stage}:${var.image_tag}"
    environment               = var.stage
    region                    = var.region
    log_group_arn             = aws_cloudwatch_log_group.ecs_service_logs.arn
  }
}

resource "aws_cloudwatch_log_group" "ecs_service_logs" {
  name = "${var.application}-container-${var.stage}"
  retention_in_days = 30

  tags = local.common_tags
}

###
# Below is release branch blue/green deployment only
###

# New green target group -> new green ECS cluster
resource "aws_lb_target_group" "alb_blue_green_tg" {
  count       = local.trimmed_stage == "prod" ? 1 : 0

  name        = "myriaverse-node-${var.stage}" // "name" cannot be longer than 32 characters
  port        = 8080 # Needs to be same as containers
  protocol    = "HTTP"
  target_type = "ip"
  vpc_id      = data.aws_vpc.myria_vpc.id

  tags = local.common_tags
}

# A placeholder otherwise AWS returns error of "No TG associated to the ALB" in aws_ecs_service.ecs_service.load_balancer
resource "aws_lb_listener" "alb_blue_green_listener" {
  count       = local.trimmed_stage == "prod" ? 1 : 0

  load_balancer_arn = data.aws_lb.alb.arn
  port              = "443"

  default_action {
    type = "forward"
    target_group_arn = aws_lb_target_group.alb_blue_green_tg[0].arn
  }

  tags = local.common_tags
}
