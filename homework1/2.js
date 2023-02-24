class Calculator {
    /*
    Написать модуль, который способен выполнять операции с числами любой длины.
     */

    static add(a, b) {
        return BigInt(a) + BigInt(b);
    }

    static subtract(a, b) {
        return BigInt(a) - BigInt(b);
    }

    static multiply(a, b) {
        return BigInt(a) * BigInt(b);
    }

    static divide(a, b) {
        return BigInt(a) / BigInt(b);
    }
}



