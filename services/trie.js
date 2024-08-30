// const User = require('../models/User');

// class TrieNode {
//   constructor() {
//     this.children = {};
//     this.isEndOfWord = false;
//   }
// }

// class Trie {
//   constructor() {
//     this.root = new TrieNode();
//   }

//   insert(word) {
//     let node = this.root;
//     for (const char of word) {
//       if (!node.children[char]) {
//         node.children[char] = new TrieNode();
//       }
//       node = node.children[char];
//     }
//     node.isEndOfWord = true;
//   }

//   search(prefix) {
//     let node = this.root;
//     for (const char of prefix) {
//       if (!node.children[char]) {
//         return [];
//       }
//       node = node.children[char];
//     }
//     return this._getWordsFromNode(node, prefix);
//   }

//   _getWordsFromNode(node, prefix) {
//     const words = [];
//     if (node.isEndOfWord) {
//       words.push(prefix);
//     }
//     for (const char in node.children) {
//       words.push(...this._getWordsFromNode(node.children[char], prefix + char));
//     }
//     return words;
//   }
// }

// async function populateTrie() {
//   const trie = new Trie();
//   try {
//     const users = await User.find({}, 'username');
//     users.forEach(user => trie.insert(user.username));
//   } catch (err) {
//     console.error('Error populating Trie:', err.message);
//   }
//   return trie;
// }

// module.exports = { Trie, populateTrie };
