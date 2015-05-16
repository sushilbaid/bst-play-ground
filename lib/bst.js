'use strict';
var assert = require('chai').assert,
    util = require('util');

var tree = {};
module.exports = tree;
var Node = function Node(value)
{
    this.value = value;
}

Node.prototype.visitPostOrder = function visitPostOrder()
{
    assert.isNumber(this.value);
    var result = [];
    if (this.left)
        result.push.apply(result, this.left.visitPostOrder());
    if (this.right)
        result.push.apply(result, this.right.visitPostOrder());
    result.push(this.value);
    return result;
}

Node.prototype.visitInOrder = function visitInOrder()
{
    assert.isNumber(this.value);
    var result = [];
    if (this.left)
        result.push.apply(result, this.left.visitInOrder());
    result.push(this.value);
    if (this.right)
        result.push.apply(result, this.right.visitInOrder());
    return result;
}

tree.createNode = function createNode(value)
{
    return new Node(value);
}

// create tree given in order and post order
tree.createTree = function createTree(inOrder, postOrder)
{
    assert.isArray(inOrder);
    assert.isArray(postOrder);
    assert(inOrder.length == postOrder.length, 'inorder and post order should have same length');
    return tree.createSubTree(inOrder, postOrder, 0, 0, inOrder.length);
}

tree.createSubTree = function createSubTree(inOrder, postOrder, inStart, postStart, size)
{
    assert.isNumber(inStart);
    assert.isNumber(postStart);
    assert.isNumber(size);
    if (size == 0)
        return undefined;
    var nodeValue = postOrder[postStart + size - 1];
    var nodeIndex = findIndex(inOrder, inStart, size, nodeValue);
    var node = tree.createNode(nodeValue);
    var left = {
        inStart: inStart,
        postStart: postStart,
        size: nodeIndex - inStart
    };
    var right = {
        inStart: nodeIndex + 1,
        postStart: postStart + left.size,
        size: size - left.size - 1,
    };
    node.left = tree.createSubTree(inOrder, postOrder, left.inStart, left.postStart, left.size);
    node.right = tree.createSubTree(inOrder, postOrder, right.inStart, right.postStart, right.size);
    return node;
}

function findIndex(array, start, size, value)
{
    for (var i = start; i < start + size; i++)
        if (array[i] === value)
            return i;
    throw new Error(util.format('value (%d) - not found', value));
}