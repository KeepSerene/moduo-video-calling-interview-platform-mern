export const PROBLEMS = {
  "two-sum": {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    category: "Array • Hash Table",
    description: {
      text: "Given an array of integers nums and an integer target, return indices of the two numbers in the array such that they add up to target.",
      notes: [
        "You may assume that each input would have exactly one solution, and you may not use the same element twice.",
        "You can return the answer in any order.",
      ],
    },
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
        explanation: "Because nums[1] + nums[2] == 6, we return [1, 2].",
      },
      {
        input: "nums = [3,3], target = 6",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 6, we return [0, 1].",
      },
    ],
    constraints: [
      "2 ≤ nums.length ≤ 10⁴",
      "-10⁹ ≤ nums[i] ≤ 10⁹",
      "-10⁹ ≤ target ≤ 10⁹",
      "Only one valid answer exists",
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {
  // Write your solution here
  
}

// Test cases
console.log(JSON.stringify(twoSum([2, 7, 11, 15], 9))); // Expected: [0,1]
console.log(JSON.stringify(twoSum([3, 2, 4], 6))); // Expected: [1,2]
console.log(JSON.stringify(twoSum([3, 3], 6))); // Expected: [0,1]`,
      python: `def twoSum(nums, target):
    # Write your solution here
    pass

# Test cases
print(twoSum([2, 7, 11, 15], 9))  # Expected: [0, 1]
print(twoSum([3, 2, 4], 6))  # Expected: [1, 2]
print(twoSum([3, 3], 6))  # Expected: [0, 1]`,
      java: `import java.util.*;

class Solution {
    public static int[] twoSum(int[] nums, int target) {
        // Write your solution here
        
        return new int[0];
    }
    
    public static void main(String[] args) {
        System.out.println(Arrays.toString(twoSum(new int[]{2, 7, 11, 15}, 9))); // Expected: [0, 1]
        System.out.println(Arrays.toString(twoSum(new int[]{3, 2, 4}, 6))); // Expected: [1, 2]
        System.out.println(Arrays.toString(twoSum(new int[]{3, 3}, 6))); // Expected: [0, 1]
    }
}`,
    },
    expectedOutput: {
      javascript: "[0,1]\n[1,2]\n[0,1]",
      python: "[0, 1]\n[1, 2]\n[0, 1]",
      java: "[0, 1]\n[1, 2]\n[0, 1]",
    },
    hints: [
      "A simple approach is to use two nested loops to check every pair of numbers.",
      "Can you solve it in O(n) time? Think about using a hash table to store numbers you've seen.",
      "For each number, check if (target - current number) exists in your hash table.",
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
  },

  "reverse-string": {
    id: "reverse-string",
    title: "Reverse String",
    difficulty: "Easy",
    category: "String • Two Pointers",
    description: {
      text: "Write a function that reverses a string. The input string is given as an array of characters.",
      notes: [
        "You must do this by modifying the input array in-place with O(1) extra memory.",
      ],
    },
    examples: [
      {
        input: 's = ["h","e","l","l","o"]',
        output: '["o","l","l","e","h"]',
        explanation: "Reverse the array of characters in-place.",
      },
      {
        input: 's = ["H","a","n","n","a","h"]',
        output: '["h","a","n","n","a","H"]',
        explanation: "Reverse the array of characters in-place.",
      },
    ],
    constraints: ["1 ≤ s.length ≤ 10⁵", "s[i] is a printable ASCII character"],
    starterCode: {
      javascript: `function reverseString(s) {
  // Write your solution here
  
}

// Test cases
let test1 = ["h","e","l","l","o"];
reverseString(test1);
console.log(JSON.stringify(test1)); // Expected: ["o","l","l","e","h"]

let test2 = ["H","a","n","n","a","h"];
reverseString(test2);
console.log(JSON.stringify(test2)); // Expected: ["h","a","n","n","a","H"]`,
      python: `def reverseString(s):
    # Write your solution here
    pass

# Test cases
test1 = ["h","e","l","l","o"]
reverseString(test1)
print(test1)  # Expected: ['o', 'l', 'l', 'e', 'h']

test2 = ["H","a","n","n","a","h"]
reverseString(test2)
print(test2)  # Expected: ['h', 'a', 'n', 'n', 'a', 'H']`,
      java: `import java.util.*;

class Solution {
    public static void reverseString(char[] s) {
        // Write your solution here
        
    }
    
    public static void main(String[] args) {
        char[] test1 = {'h','e','l','l','o'};
        reverseString(test1);
        System.out.println(Arrays.toString(test1)); // Expected: [o, l, l, e, h]
        
        char[] test2 = {'H','a','n','n','a','h'};
        reverseString(test2);
        System.out.println(Arrays.toString(test2)); // Expected: [h, a, n, n, a, H]
    }
}`,
    },
    expectedOutput: {
      javascript: '["o","l","l","e","h"]\n["h","a","n","n","a","H"]',
      python: "['o', 'l', 'l', 'e', 'h']\n['h', 'a', 'n', 'n', 'a', 'H']",
      java: "[o, l, l, e, h]\n[h, a, n, n, a, H]",
    },
    hints: [
      "Use the two-pointer technique with one pointer at the start and one at the end.",
      "Swap characters and move pointers toward the center.",
      "Remember to modify the array in-place without using extra space.",
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
  },

  "valid-palindrome": {
    id: "valid-palindrome",
    title: "Valid Palindrome",
    difficulty: "Easy",
    category: "String • Two Pointers",
    description: {
      text: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.",
      notes: [
        "Given a string s, return true if it is a palindrome, or false otherwise.",
      ],
    },
    examples: [
      {
        input: 's = "A man, a plan, a canal: Panama"',
        output: "true",
        explanation: '"amanaplanacanalpanama" is a palindrome.',
      },
      {
        input: 's = "race a car"',
        output: "false",
        explanation: '"raceacar" is not a palindrome.',
      },
      {
        input: 's = " "',
        output: "true",
        explanation:
          's is an empty string "" after removing non-alphanumeric characters. Since an empty string reads the same forward and backward, it is a palindrome.',
      },
    ],
    constraints: [
      "1 ≤ s.length ≤ 2 × 10⁵",
      "s consists only of printable ASCII characters",
    ],
    starterCode: {
      javascript: `function isPalindrome(s) {
  // Write your solution here
  
}

// Test cases
console.log(isPalindrome("A man, a plan, a canal: Panama")); // Expected: true
console.log(isPalindrome("race a car")); // Expected: false
console.log(isPalindrome(" ")); // Expected: true`,
      python: `def isPalindrome(s):
    # Write your solution here
    pass

# Test cases
print(isPalindrome("A man, a plan, a canal: Panama"))  # Expected: True
print(isPalindrome("race a car"))  # Expected: False
print(isPalindrome(" "))  # Expected: True`,
      java: `class Solution {
    public static boolean isPalindrome(String s) {
        // Write your solution here
        
        return false;
    }
    
    public static void main(String[] args) {
        System.out.println(isPalindrome("A man, a plan, a canal: Panama")); // Expected: true
        System.out.println(isPalindrome("race a car")); // Expected: false
        System.out.println(isPalindrome(" ")); // Expected: true
    }
}`,
    },
    expectedOutput: {
      javascript: "true\nfalse\ntrue",
      python: "True\nFalse\nTrue",
      java: "true\nfalse\ntrue",
    },
    hints: [
      "First, clean the string by removing non-alphanumeric characters and converting to lowercase.",
      "Use two pointers, one at the start and one at the end, to compare characters.",
      "Alternatively, you can clean the string and compare it with its reverse.",
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1) with two pointers, O(n) if creating cleaned string",
  },

  "maximum-subarray": {
    id: "maximum-subarray",
    title: "Maximum Subarray",
    difficulty: "Medium",
    category: "Array • Dynamic Programming",
    description: {
      text: "Given an integer array nums, find the subarray with the largest sum, and return its sum.",
      notes: ["A subarray is a contiguous part of an array."],
    },
    examples: [
      {
        input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        output: "6",
        explanation: "The subarray [4,-1,2,1] has the largest sum 6.",
      },
      {
        input: "nums = [1]",
        output: "1",
        explanation: "The subarray [1] has the largest sum 1.",
      },
      {
        input: "nums = [5,4,-1,7,8]",
        output: "23",
        explanation: "The subarray [5,4,-1,7,8] has the largest sum 23.",
      },
    ],
    constraints: ["1 ≤ nums.length ≤ 10⁵", "-10⁴ ≤ nums[i] ≤ 10⁴"],
    starterCode: {
      javascript: `function maxSubArray(nums) {
  // Write your solution here
  
}

// Test cases
console.log(maxSubArray([-2,1,-3,4,-1,2,1,-5,4])); // Expected: 6
console.log(maxSubArray([1])); // Expected: 1
console.log(maxSubArray([5,4,-1,7,8])); // Expected: 23`,
      python: `def maxSubArray(nums):
    # Write your solution here
    pass

# Test cases
print(maxSubArray([-2,1,-3,4,-1,2,1,-5,4]))  # Expected: 6
print(maxSubArray([1]))  # Expected: 1
print(maxSubArray([5,4,-1,7,8]))  # Expected: 23`,
      java: `class Solution {
    public static int maxSubArray(int[] nums) {
        // Write your solution here
        
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(maxSubArray(new int[]{-2,1,-3,4,-1,2,1,-5,4})); // Expected: 6
        System.out.println(maxSubArray(new int[]{1})); // Expected: 1
        System.out.println(maxSubArray(new int[]{5,4,-1,7,8})); // Expected: 23
    }
}`,
    },
    expectedOutput: {
      javascript: "6\n1\n23",
      python: "6\n1\n23",
      java: "6\n1\n23",
    },
    hints: [
      "Think about dynamic programming: what information do you need to track at each position?",
      "Kadane's algorithm is an efficient approach - keep track of the maximum sum ending at the current position.",
      "At each position, decide whether to extend the existing subarray or start a new one.",
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
  },

  "container-with-most-water": {
    id: "container-with-most-water",
    title: "Container with Most Water",
    difficulty: "Medium",
    category: "Array • Two Pointers",
    description: {
      text: "You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).",
      notes: [
        "Find two lines that together with the x-axis form a container, such that the container contains the most water.",
        "Return the maximum amount of water a container can store.",
        "Notice that you may not slant the container.",
      ],
    },
    examples: [
      {
        input: "height = [1,8,6,2,5,4,8,3,7]",
        output: "49",
        explanation:
          "The vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. The max area is obtained with heights at indices 1 and 8: min(8,7) × (8-1) = 7 × 7 = 49.",
      },
      {
        input: "height = [1,1]",
        output: "1",
        explanation: "The max area is 1 × 1 = 1.",
      },
    ],
    constraints: ["n == height.length", "2 ≤ n ≤ 10⁵", "0 ≤ height[i] ≤ 10⁴"],
    starterCode: {
      javascript: `function maxArea(height) {
  // Write your solution here
  
}

// Test cases
console.log(maxArea([1,8,6,2,5,4,8,3,7])); // Expected: 49
console.log(maxArea([1,1])); // Expected: 1`,
      python: `def maxArea(height):
    # Write your solution here
    pass

# Test cases
print(maxArea([1,8,6,2,5,4,8,3,7]))  # Expected: 49
print(maxArea([1,1]))  # Expected: 1`,
      java: `class Solution {
    public static int maxArea(int[] height) {
        // Write your solution here
        
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(maxArea(new int[]{1,8,6,2,5,4,8,3,7})); // Expected: 49
        System.out.println(maxArea(new int[]{1,1})); // Expected: 1
    }
}`,
    },
    expectedOutput: {
      javascript: "49\n1",
      python: "49\n1",
      java: "49\n1",
    },
    hints: [
      "The area is determined by the shorter line and the distance between the two lines.",
      "Use two pointers starting from both ends of the array.",
      "Move the pointer pointing to the shorter line inward - why? Because moving the taller line won't increase the area.",
    ],
    timeComplexity: "O(n)",
    spaceComplexity: "O(1)",
  },

  "merge-k-sorted-lists": {
    id: "merge-k-sorted-lists",
    title: "Merge k Sorted Lists",
    difficulty: "Hard",
    category: "Linked List • Divide and Conquer • Heap (Priority Queue)",
    description: {
      text: "You are given an array of k linked-lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
      notes: [
        "Each linked list is sorted in ascending order.",
        "Analyze and optimize the time complexity.",
      ],
    },
    examples: [
      {
        input: "lists = [[1,4,5],[1,3,4],[2,6]]",
        output: "[1,1,2,3,4,4,5,6]",
        explanation:
          "The linked lists are:\n[\n  1→4→5,\n  1→3→4,\n  2→6\n]\nMerging them into one sorted list: 1→1→2→3→4→4→5→6",
      },
      {
        input: "lists = []",
        output: "[]",
        explanation: "No lists to merge, return empty list.",
      },
      {
        input: "lists = [[]]",
        output: "[]",
        explanation: "Single empty list, return empty list.",
      },
    ],
    constraints: [
      "k == lists.length",
      "0 ≤ k ≤ 10⁴",
      "0 ≤ lists[i].length ≤ 500",
      "-10⁴ ≤ lists[i][j] ≤ 10⁴",
      "lists[i] is sorted in ascending order",
      "The sum of lists[i].length will not exceed 10⁴",
    ],
    starterCode: {
      javascript: `class ListNode {
  constructor(val = 0, next = null) {
    this.val = val;
    this.next = next;
  }
}

function mergeKLists(lists) {
  // Write your solution here
  
}

// Helper functions for testing
function arrayToList(arr) {
  if (!arr || arr.length === 0) return null;
  const dummy = new ListNode();
  let current = dummy;
  for (const val of arr) {
    current.next = new ListNode(val);
    current = current.next;
  }
  return dummy.next;
}

function listToArray(head) {
  const result = [];
  while (head) {
    result.push(head.val);
    head = head.next;
  }
  return result;
}

// Test cases
const lists1 = [arrayToList([1,4,5]), arrayToList([1,3,4]), arrayToList([2,6])];
console.log(JSON.stringify(listToArray(mergeKLists(lists1)))); // Expected: [1,1,2,3,4,4,5,6]

const lists2 = [];
console.log(JSON.stringify(listToArray(mergeKLists(lists2)))); // Expected: []

const lists3 = [arrayToList([])];
console.log(JSON.stringify(listToArray(mergeKLists(lists3)))); // Expected: []`,
      python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def mergeKLists(lists):
    # Write your solution here
    pass

# Helper functions for testing
def array_to_list(arr):
    if not arr:
        return None
    dummy = ListNode()
    curr = dummy
    for val in arr:
        curr.next = ListNode(val)
        curr = curr.next
    return dummy.next

def list_to_array(head):
    result = []
    while head:
        result.append(head.val)
        head = head.next
    return result

# Test cases
lists1 = [array_to_list([1,4,5]), array_to_list([1,3,4]), array_to_list([2,6])]
print(list_to_array(mergeKLists(lists1)))  # Expected: [1,1,2,3,4,4,5,6]

lists2 = []
print(list_to_array(mergeKLists(lists2)))  # Expected: []

lists3 = [array_to_list([])]
print(list_to_array(mergeKLists(lists3)))  # Expected: []`,
      java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public static ListNode mergeKLists(ListNode[] lists) {
        // Write your solution here
        
        return null;
    }
    
    // Helper functions for testing
    public static ListNode arrayToList(int[] arr) {
        if (arr == null || arr.length == 0) return null;
        ListNode dummy = new ListNode();
        ListNode curr = dummy;
        for (int val : arr) {
            curr.next = new ListNode(val);
            curr = curr.next;
        }
        return dummy.next;
    }
    
    public static String listToString(ListNode head) {
        List<Integer> result = new ArrayList<>();
        while (head != null) {
            result.add(head.val);
            head = head.next;
        }
        return result.toString();
    }

    public static void main(String[] args) {
        ListNode l1 = arrayToList(new int[]{1,4,5});
        ListNode l2 = arrayToList(new int[]{1,3,4});
        ListNode l3 = arrayToList(new int[]{2,6});
        ListNode[] lists1 = {l1, l2, l3};
        System.out.println(listToString(mergeKLists(lists1))); // Expected: [1, 1, 2, 3, 4, 4, 5, 6]
        
        ListNode[] lists2 = {};
        System.out.println(listToString(mergeKLists(lists2))); // Expected: []
        
        ListNode[] lists3 = {null};
        System.out.println(listToString(mergeKLists(lists3))); // Expected: []
    }
}`,
    },
    expectedOutput: {
      javascript: "[1,1,2,3,4,4,5,6]\n[]\n[]",
      python: "[1, 1, 2, 3, 4, 4, 5, 6]\n[]\n[]",
      java: "[1, 1, 2, 3, 4, 4, 5, 6]\n[]\n[]",
    },
    hints: [
      "Brute force: Collect all values, sort them, and create a new linked list. What's the time complexity?",
      "Can you merge the lists one by one? Start by merging list1 with list2, then merge the result with list3, and so on.",
      "Use a min-heap (priority queue) to efficiently get the smallest node among all k lists.",
      "Divide and conquer: Pair up k lists and merge each pair in parallel, then repeat until one list remains.",
    ],
    timeComplexity:
      "O(N log k) where N is total number of nodes and k is number of lists (using heap)",
    spaceComplexity:
      "O(k) for the heap, or O(1) if using divide and conquer with constant space merging",
  },
};

export const LANGUAGE_CONFIGS = {
  javascript: {
    name: "JavaScript",
    imgSrc: "/images/javascript.png",
    monacoLang: "javascript",
  },
  python: {
    name: "Python",
    imgSrc: "/images/python.png",
    monacoLang: "python",
  },
  java: {
    name: "Java",
    imgSrc: "/images/java.png",
    monacoLang: "java",
  },
};
