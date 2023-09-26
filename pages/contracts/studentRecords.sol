// SPDX-License-Identifier: MIT
pragma solidity  0.8.18;

contract studentRecord {
    address public student;
    uint public score;

    // use require
    function setScore(uint _score) public{
        score = _score;
    }

    function setStudent(address _student) public {
        student = _student;
    }
}
