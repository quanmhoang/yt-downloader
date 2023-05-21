const HOST = process.env.HOST || "0.0.0.0";

const ENVIRONMENTS = {
    dev: "dev",
    test: "test",
    stage: "stage",
    prod: "production",
};

const ENV = process.env.ENV || process.env.NODE_ENV || ENVIRONMENTS.dev;
const IS_TEST = ENV === ENVIRONMENTS.test;

const PORT = process.env.PORT || 8080;

const MAXIMUM_NUMBER_OF_NODES_PER_USER = 100;
const CRON_JOB_SLEEP_IN_MS = 30_000;
const BETWEEN_PURCHASES_SLEEP_IN_MS = 1_000;
const MAX_TIME_IN_MINUTES = 30;
const USER_ID_FOR_NOT_ASSIGNED_NODES = "USER_ID_FOR_NOT_ASSIGNED_NODES";
const MAX_AVAILABLE_NODES_TO_FETCH = 100;
const MINIMUM_NUMBER_OF_CONFIRMATION_BLOCKS = 10;
const TX_HASH_VALIDATION_REGEX = "^0x([a-f0-9]{64})$";
const WALLET_ADDRESS_VALIDATION_REGEX = "^0X[A-F0-9]{40}$";
const NODE_UPTIME_PING_INVERVAL_IN_S = IS_TEST ? 5 : 900;
const NODE_UPTIME_THRESHOLD_IN_S = 21_600;
const NODE_OPERATION_NETWORK_ISSUE_THRESHOLD_IN_S = IS_TEST ? 2 : 60;
const NODE_USER_POINT_PER_CYCLE = 1;
const NODE_PURCHASE_PRICE_START_PRICE = 5500;
const NODE_PURCHASE_L2_DATA_FETCH_TIMEOUT_IN_HOURS = 24;
const NODE_PURCHASE_L2_PRECISION_DIGIT = 3;
const NODE_PURCHASE_L1_PRECISION_DIGIT = 18;
const NODE_PURCHASE_L2_QUANTUM = "10000000000";
const NODE_PURCHASE_L2_TRANSACTION_TYPE = "TransferRequest";
const NODE_PURCHASE_L2_TRANSACTION_TOKEN_TYPE = "ERC20";
const NODE_PURCHASE_L2_TRANSACTION_TOKEN_SYMBOL = "USDT";
const NODE_PURCHASE_PRICE_RAMP_SETTING = [
    {
        "PriceRamp": 5,
        "BatchSize": 4400,
        "StartingPrice": 5500
    },
    {
        "PriceRamp": 10,
        "BatchSize": 4400,
        "StartingPrice": 5610
    },
    {
        "PriceRamp": 20,
        "BatchSize": 4400,
        "StartingPrice": 5830
    },
    {
        "PriceRamp": 40,
        "BatchSize": 4400,
        "StartingPrice": 6270
    },
    {
        "PriceRamp": 80,
        "BatchSize": 4400,
        "StartingPrice": 7150
    },
    {
        "PriceRamp": 160,
        "BatchSize": 4400,
        "StartingPrice": 8910
    },
    {
        "PriceRamp": 320,
        "BatchSize": 4400,
        "StartingPrice": 12430
    },
    {
        "PriceRamp": 512,
        "BatchSize": 4400,
        "StartingPrice": 19470
    },
    {
        "PriceRamp": 819.2,
        "BatchSize": 4400,
        "StartingPrice": 30734
    }

    ]
;
const MAX_DAYS_POINTS_HISTORY = 14;
const MYRIA_TOKENS_DISTRIBUTION_DELAY_IN_DAYS = 8;
const MYRIA_TOKENS_VESTING_SCHEDULE = {
    1: 0.4,
    2: 0.5,
    3: 0.6,
    4: 0.7,
    5: 0.8,
    6: 0.9,
    7: 1.0,
};

const CORE_API_SERVICE_TIMEOUT_IN_MS = 30_000;

export default {
    ENVIRONMENTS,
    ENV,
    PORT,
    HOST,
    IS_TEST,
    NODES: {
        MAXIMUM_NUMBER_OF_NODES_PER_USER,
        TX_HASH_VALIDATION_REGEX,
        WALLET_ADDRESS_VALIDATION_REGEX,
        NODE_UPTIME_PING_INVERVAL_IN_S,
        NODE_UPTIME_THRESHOLD_IN_S,
        NODE_OPERATION_NETWORK_ISSUE_THRESHOLD_IN_S,
        NODE_USER_POINT_PER_CYCLE,
        NODE_PURCHASE_PRICE_RAMP_SETTING,
        NODE_PURCHASE_PRICE_START_PRICE,
        NODE_PURCHASE_L2_DATA_FETCH_TIMEOUT_IN_HOURS,
        NODE_PURCHASE_L2_PRECISION_DIGIT,
        NODE_PURCHASE_L1_PRECISION_DIGIT,
        NODE_PURCHASE_L2_TRANSACTION_TYPE,
        NODE_PURCHASE_L2_TRANSACTION_TOKEN_TYPE,
        NODE_PURCHASE_L2_TRANSACTION_TOKEN_SYMBOL,
        NODE_PURCHASE_L2_QUANTUM
    },
    VERIFICATION: {
        CRON_JOB_SLEEP_IN_MS,
        BETWEEN_PURCHASES_SLEEP_IN_MS,
        MAX_TIME_IN_MINUTES,
        USER_ID_FOR_NOT_ASSIGNED_NODES,
        MAX_AVAILABLE_NODES_TO_FETCH,
        MINIMUM_NUMBER_OF_CONFIRMATION_BLOCKS,
    },
    NODES_OPERATIONS: {
        NODE_NOT_RUNNING: "Node not running error",
        NODE_ALREADY_RUNNING: "Node already running error",
    },
    MAX_DAYS_POINTS_HISTORY,
    MYRIA_TOKENS_DISTRIBUTION_DELAY_IN_DAYS,
    MYRIA_TOKENS_VESTING_SCHEDULE,
    CORE_API_SERVICE_TIMEOUT_IN_MS,
};
