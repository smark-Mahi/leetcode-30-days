/*
2649. Nested Array Generator
Medium
107
6
Companies
Given a multi-dimensional array of integers, return a generator object which yields integers in the same order as inorder traversal.

A multi-dimensional array is a recursive data structure that contains both integers and other multi-dimensional arrays.

inorder traversal iterates over each array from left to right, yielding any integers it encounters or applying inorder traversal to any arrays it encounters.

 

Example 1:

Input: arr = [[[6]],[1,3],[]]
Output: [6,1,3]
Explanation:
const generator = inorderTraversal(arr);
generator.next().value; // 6
generator.next().value; // 1
generator.next().value; // 3
generator.next().done; // true
Example 2:

Input: arr = []
Output: []
Explanation: There are no integers so the generator doesn't yield anything.
*/

//Editorial

/*
We are given a multi-dimensional array of integers and arrays. We need to create a generator function that yields the integers in the same order as an inorder traversal of the array. We can utilize the power of generators beautifully by implementing a solution that allows us to lazily generate and yield the integers as they are encountered, rather than computing or storing all the values upfront. Since we are doing operations on demand it becomes much more efficient both speed wise and memory wise.

Use Cases:
Processing Large Data Sets: When dealing with large datasets, it is often impractical or impossible to load all the data into memory at once. Generators can be used to lazily iterate over the data, processing one item at a time, thus reducing memory usage. For example, when reading data from a file or fetching data from a server, generators can be used to process the data in chunks or on-the-fly.

Example: Reading a large CSV file and processing it row by row using a generator function to minimize memory usage.
Pagination and Infinite Scrolling: Generators can be helpful in scenarios where data is fetched from an API in paginated form or through infinite scrolling. Instead of loading and storing all the data at once, generators can be used to fetch and process data page by page or as the user scrolls, improving performance and reducing memory consumption.

Example: Fetching data from an API that provides paginated results, using a generator to lazily load and process each page of data as needed.
Tree Traversal: When working with tree-like data structures, such as hierarchical file systems or nested categories, generators can facilitate tree traversal algorithms. Generators can yield nodes in a specific order, such as preorder, inorder, or postorder, enabling efficient processing of the tree without the need to store the entire tree structure in memory. This is the crux of our question.

Example: Navigating through a nested directory structure and processing files in an inorder traversal using a generator to yield each file path.
State Machine and Workflow Management: Generators can be employed to build state machines or manage complex workflows. Each state or step of the workflow can be represented by a generator function, allowing for easy control flow, suspension, and resumption of execution.

Example: Imagine you are developing a chess engine that needs to handle the different states and moves of a game. Each move in chess involves a sequence of actions, such as selecting a piece, choosing a destination square, and applying the move to the game board. To manage the game state and move execution, you can use generators. Each state of the game and move can be represented by a generator function.
Also let's say if the player decides to quit, they can trigger an action that stops the generator, ending the game. This also showcases one more feature of generators i.e Two-way communication between the generator code and the 'execution engine' (In this case the game code and the player) this feature gives dynamic control flow and the ability to cancel the game based on user input.
Approach 1: Recursive Solution
Intuition:
We can use a recursive generator to yield the elements from the nested arrays.

Algorithm:

If the element is not an array, it means it is an integer. In this case, the generator function yields the element, making it available for the caller of the generator. By using the yield statement, the generator function suspends its execution, allowing the caller to retrieve the yielded value. The generator function can then be resumed from where it left off, continuing the loop and traversing the array further.
After taking care of the condition "if it's an integer" now lets check about the left out condition i.e. "if the array is a nested array". In this case we use a for loop that iterates over each element of the array using the index i.
Now since we have encountered a nested array within the original array. The generator function recursively calls itself by invoking yield* inorderTraversal(arr[i]). This recursive call applies the same logic to the nested array, ensuring that it is also traversed in an inorder manner. yield* is used when we want to delegate to another Generator (in this case the recursive call). Returns the value returned by that iterator when it's closed.
The generator yields integers in the same order as they are encountered during the traversal.
If you're still not sure about yield*, let's use an analogy to explain what "yield*" means:

Now imagine you are a tour guide taking a group of people on an adventure through a dense forest. As you navigate through the forest, you come across different paths, each leading to a new and exciting location. Instead of leading the entire group through each path all at once, you have a special ability called "yield". With this ability, you can pause and allow one person from the group to explore a path while the rest of the group waits. That person can then return and share their experience before another person takes their turn to explore a different path. This way, everyone gets a chance to discover and enjoy the various hidden treasures in the forest, one by one, using the power of "yield*". I hope this analogy will help you all.
Implementation:


/**
 * @param {Array} arr
 * @return {Generator}
 
var inorderTraversal = function* (arr) {
    if(!Array.isArray(arr)) {
        yield arr
        return
    }

    for(let i = 0; i < arr.length; i++) {
        yield* inorderTraversal(arr[i])
    }
};

Complexity Analysis:
Time complexity: O(N)O(N)O(N), where NNN is the total number of elements in the array.
Space complexity: O(D)O(D)O(D), where DDD is the depth of the recursion call.
Approach 2: Interative Solution Using Stack
Intuition:

We can use a stack based approach to simulate an iterative inorder traversal of the array.
We can process the elements by pushing them onto the stack and yielding them when they are not arrays.
This approach is way better than previous recursive approach as it will be faster and more space efficient.

Algorithm:
We will use a stack data structure to keep track of the elements. Initially, the stack contains the entire input array arr.
After initializing the stack we use a while loop that continues until the stack is empty.
Within the loop we will retrieve the top most element from the stack and if the current element is an array it means we have encountered a nested array. In this case we iterate over the elemet in reverse order to ensure that when we pop the element the element are popped in reverse order
Now if the current element is not an array it means it's an integer. In this case, the generator function yields the element, making it available for the caller of the generator.
In the end, the while loop continues until the stack is empty, ensuring that all elements of the array and its nested arrays are processed.
Implementation:

var inorderTraversal = function* (arr) {
  const stack = [arr];
  
  while (stack.length > 0) {
    const current = stack.pop();

    if (!Array.isArray(current)) {
      yield current;
      continue;
    }

    for (let i = current.length - 1; i >= 0; i--) {
      stack.push(current[i]);
    }
  }
}

Complexity Analysis:
Time complexity: O(N)O(N)O(N), where NNN is the total number of elements in the array. Since the loop will iterate over all elements to store them inside the stack.
Space complexity: O(N)O(N)O(N), Since it uses a stack to store all the elements of the array.
Approach 3: Using Flat Method
Intuition:
By this point have you thought that why you can yield* an array. What are the actual mechanics of yield* and arrays (iterables) that allow them to work together so seemlessly?
If not, let's think..

The reason yield* works with arrays is because arrays in JavaScript are iterable objects. Iterables are objects that implement the iterable protocol, which means they have a method called [Symbol.iterator]() that returns an iterator object. The iterator object is responsible for producing the values of the iterable in a sequential manner.
When a generator uses yield* with an array, it effectively delegates the iteration control to the iterator of the array. The generator suspends its execution and yields values produced by iterating over the array's iterator. Once the array is fully iterated, the generator resumes execution i.e., it defines a common mechanism for iterating over different iterable objects. It allows generators to work with various types of iterables, including arrays, without the need for explicit handling of each type.
Algorithm:
We can use a built-in function flat() to get flat array with param Infinity to flatten all levels.

The flat() method iterates over each element of the array and checks if the element is an array itself and accepts an optional parameter, depth, which specifies the depth level to which the array should be flattened. If no depth parameter is provided, the default depth is 1.
Important Note: Using the flat() method in this case defeats the purpose of avoiding upfront memory allocation. This approach is mentioned just for easy understanding "why you can yield* an array?".

Implementation:

/**
 * @param {Array} arr
 * @return {Generator}
 
var inorderTraversal = function*(arr) {
    yield* arr.flat(Infinity);
  };


  /**
 * @param {Array} arr
 * @return {Generator}
 
var inorderTraversal = function*(arr) {
    yield* arr.flat(Infinity);
  };

Complexity Analysis:
Time complexity: The time complexity of the flat() method is O(N)O(N)O(N), where NNN is the total number of elements in the array. Since the generator function yields each element of the flattened array once, the overall time complexity of the function is also O(N)O(N)O(N).
Space complexity: The space complexity of the flat() method is also O(N)O(N)O(N), since it creates a new flattened array. The generator function does not create any new data structures, so the overall space complexity is also O(N)O(N)O(N).
Interview Tips:
How does the use of JavaScript generators contribute to the efficiency and memory-friendliness of the solution?

JavaScript generators enable the generation and yielding of integers on-demand, reducing the need to compute or store all values upfront. This lazy evaluation approach minimizes memory usage by only keeping track of the current state and necessary information to continue the traversal, rather than storing all values in memory simultaneously.
What are some potential challenges or considerations when implementing the nested array generator?

One challenge could be handling the recursion aspect of the problem, as the generator needs to recursively apply the inorder traversal to nested arrays. Proper termination conditions and handling of different array shapes or sizes are important considerations to ensure correct and efficient traversal.
Can you explain how the concept of generators relates to the concept of iterators in JavaScript?

Generators are a type of iterator in JavaScript. They follow the iterator protocol, allowing sequential access to a sequence of values. However, unlike regular iterators, generators provide additional functionality by allowing suspension and resumption of execution, making them particularly useful in scenarios where values need to be generated on-demand.


*/
