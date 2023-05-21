import BigNumber from "bignumber.js";
import { ethers } from "ethers";
import * as jwt from "jsonwebtoken";


const sleep = async function (sleepTimeInMs) {
    return new Promise((resolve) => setTimeout(resolve, sleepTimeInMs));
};

const dateTimeDiffInS = (fromDate: Date, toDate: Date): number => {
    return Math.round(Math.abs(toDate.getTime() - fromDate.getTime()) / 1000);
};

const groupByKey = (list: unknown[], key: string) =>
    list.reduce(
        // eslint-disable-next-line
        (hash: any, obj: any) => ({ ...hash, [obj[key]]: (hash[obj[key]] || []).concat(obj) }),
        {}
    );

const getPriceInMyria = (): number => {
    return 0.01;
};

const getDateString = (date: Date): string => date.toISOString().slice(0, 10);

const convertQuantizedAmountToOriginalAmount = (quantizedAmount: string, quantum: string): string => {
    const quantumBn = BigNumber(quantum);
    const quantizedAmountBn = BigNumber(quantizedAmount);
    const weiAmount = quantizedAmountBn.multipliedBy(quantumBn).toString();
    const originalValue = ethers.utils.formatEther(weiAmount).toString();
    return originalValue;
};

const validateKey = (token: string, secret: string): Object => {
    try {
        return jwt.verify(token, secret, {
            algorithms: ["HS256"]
        });
    } catch (err) {
        throw new Error(err.message);
    }
};

const generateKey = (data: object, secret: string) => {
    try {
        return jwt.sign(
            {
                timestamp: new Date().getTime(),
                ...data,
            },
            secret,
            {
                algorithm: "HS256",
            }
        );
    } catch (err) {
        throw new Error(err.message);
    }
};
export default {
    sleep,
    dateTimeDiffInS,
    groupByKey,
    getPriceInMyria,
    getDateString,
    convertQuantizedAmountToOriginalAmount,
    generateKey,
    validateKey
};
