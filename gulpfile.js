"use strict";
const gulp = require("gulp");
const ts = require("gulp-typescript");
const tslint = require("gulp-tslint");
const del = require("del");

const SRC_TS = "src/**/*.ts";

const tsProject = ts.createProject("tsconfig.json");

// task to clean all files in build folder
gulp.task("clean:build", () => {
    return del(["build/**/*"]);
});

gulp.task("tslint", () => {
    return gulp
        .src(SRC_TS)
        .pipe(
            tslint({
                formatter: "verbose",
            })
        )
        .pipe(tslint.report());
});

// Copy Swagger Doc
gulp.task("copy-swagger-doc", () => {
    return gulp.src("./src/**/*.json").pipe(gulp.dest("./build/src"));
});

// Copy Config File
gulp.task("copy-config-files", () => {
    return gulp.src("./config/**/*.json").pipe(gulp.dest("./build/config"));
});

// Copy whitelist File
gulp.task("copy-whitelist-files", () => {
    return gulp.src("./src/**/*.csv").pipe(gulp.dest("./build/src"));
});

// task to transpile all typescripts into javascript in build folder
gulp.task("build-code", () => {
    return tsProject.src().pipe(tsProject()).js.pipe(gulp.dest("build"));
});

gulp.task(
    "build",
    gulp.parallel("copy-config-files", "build-code")
);

// tasks to watch over changes
gulp.task("watch", () => {
    gulp.watch(SRC_TS, gulp.series("tslint", "build"));
});

// default tasks
gulp.task("default", gulp.series("clean:build", "build", "watch"), () => {
    console.log("Project successfully build");
});
