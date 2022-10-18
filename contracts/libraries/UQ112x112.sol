pragma solidity =0.5.16;

// a library for handling binary fixed point numbers (https://en.wikipedia.org/wiki/Q_(number_format))

// range: [0, 2**112 - 1]
// resolution: 1 / 2**112

library UQ112x112 {
    uint224 constant Q112 = 2**112;

    // 编码：将一个uint112的值编码为uint224
    // uint112 0x01 => 00000000_0000000000000000000000000001_0000000000000000000000000000 十六进制
    // 0.5 => 00000000_0000000000000000000000000000_8000000000000000000000000000   十六进制
    //以1举例
    //00000000 => 前32位留空
    //0000000000000000000000000001 => 整数部分
    //0000000000000000000000000000 => 小数部分
    // encode a uint112 as a UQ112x112
    function encode(uint112 y) internal pure returns (uint224 z) {
        z = uint224(y) * Q112; // never overflows
    }

    // divide a UQ112x112 by a uint112, returning a UQ112x112
    // input x = logic 1, 00000000_0000000000000000000000000001_0000000000000000000000000000
    // input y = logic 2,
    // return logic 0.5, 00000000_0000000000000000000000000000_8000000000000000000000000000
    // divide a UQ112x112 by a uint112, returning a UQ112x112
    function uqdiv(uint224 x, uint112 y) internal pure returns (uint224 z) {
        z = x / uint224(y);
    }
}
