# Summary

This code is for getting most profitable outcome.
Detail is described in `problemF.pdf`.

# Algorithm description

- Sort the machines based on the day they are available for sale using insertion sort.

- Initialize a decision tree with a root node representing the initial state. Set the current machine to None, current dollars to the company dollars, and node day to 0.

- Create the decision tree by iterating over the machines. For each machine:

  - Create two child nodes (buy and stay) for each node in the current row of the decision tree.
  - Set the node day of the child nodes to the day of the current machine.
  - Calculate the profit and sell value if the current node already owns a machine.
  - If the company has enough money to buy the current machine, update the child node representing the buy option with the new state (including the purchased machine and updated dollars).
  - Update the child node representing the stay option with the current state.
  - Add the child nodes to the next row of the decision tree.

- Find the most profitable outcome by traversing the last row of the decision tree. Calculate the final profit by selling the current machine (if any) and accounting for the remaining days of restructure.

- Print the case number and the maximum profit for the company case.

# How to run

```
npm install
npx ts-node main.ts input.txt
```
