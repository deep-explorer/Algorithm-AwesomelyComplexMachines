import * as fs from "fs";

interface Machine {
  di: number;
  pi: number;
  ri: number;
  gi: number;
}

class Node {
  buy: Node | null;
  stay: Node | null;
  curr_machine: Machine | null;
  curr_dollars: number;
  node_day: number | null;

  constructor() {
    this.buy = null;
    this.stay = null;
    this.curr_machine = null;
    this.curr_dollars = 0;
    this.node_day = null;
  }
}

class CompanyMachines {
  N: number;
  C: number;
  D: number;
  machines: Machine[];

  constructor(N: number, C: number, D: number) {
    this.N = N;
    this.C = C;
    this.D = D;
    this.machines = [];
  }

  getMaxProfit(): number {
    // sort machine list
    for (let m_index = 0; m_index < this.N; m_index++) {
      let curr = m_index;
      while (curr > 0 && this.machines[curr - 1].di > this.machines[curr].di) {
        [this.machines[curr - 1], this.machines[curr]] = [
          this.machines[curr],
          this.machines[curr - 1],
        ];
        curr -= 1;
      }
    }

    // initialize a tree
    const outcome_tree = new Node();
    outcome_tree.curr_machine = null;
    outcome_tree.curr_dollars = this.C;
    outcome_tree.node_day = 0;

    let curr_row: Node[] = [outcome_tree];

    for (const machine of this.machines) {
      const next_row: Node[] = [];

      for (const outcome_tree of curr_row) {
        outcome_tree.buy = new Node();
        outcome_tree.stay = new Node();
        outcome_tree.buy.node_day = machine.di;
        outcome_tree.stay.node_day = machine.di;

        let sell_for = 0;
        let profit = 0;
        if (outcome_tree.curr_machine) {
          sell_for = outcome_tree.curr_machine.ri;
          profit =
            outcome_tree.curr_machine.gi *
            (machine.di - outcome_tree.node_day! - 1);
        }

        if (machine.pi <= outcome_tree.curr_dollars + profit + sell_for) {
          outcome_tree.buy.curr_dollars =
            outcome_tree.curr_dollars + profit + sell_for - machine.pi;
          outcome_tree.buy.curr_machine = machine;
          next_row.push(outcome_tree.buy);
        }

        outcome_tree.stay.curr_machine = outcome_tree.curr_machine;

        try {
          outcome_tree.stay.curr_dollars =
            outcome_tree.curr_dollars +
            outcome_tree.curr_machine!.gi *
              (machine.di - outcome_tree.node_day!);
        } catch (error) {
          outcome_tree.stay.curr_dollars = outcome_tree.curr_dollars;
        }

        next_row.push(outcome_tree.stay);
      }

      curr_row = next_row;
    }

    // findout outcome
    let max_outcome = 0;
    for (const outcome of curr_row) {
      try {
        const final =
          outcome.curr_dollars +
          outcome.curr_machine!.gi * (this.D - outcome.node_day!) +
          outcome.curr_machine!.ri;
        if (final > max_outcome) {
          max_outcome = final;
        }
      } catch (error) {
        const final = outcome.curr_dollars;
        if (final > max_outcome) {
          max_outcome = final;
        }
      }
    }

    return max_outcome;
  }
}

function readInput(filename: string): CompanyMachines[] {
  const input = fs.readFileSync(filename, "utf-8");
  const lines = input.trim().split("\n");
  const cases: CompanyMachines[] = [];

  let i = 0;
  while (i < lines.length) {
    const company_info = lines[i].split(" ");
    const N = parseInt(company_info[0], 10);
    const C = parseInt(company_info[1], 10);
    const D = parseInt(company_info[2], 10);
    if (N === 0 && C === 0 && D === 0) {
      break;
    }
    const caseMachines = new CompanyMachines(N, C, D);
    for (let j = 0; j < N; j++) {
      const machine_info = lines[i + j + 1].split(" ");
      const di = parseInt(machine_info[0], 10);
      const pi = parseInt(machine_info[1], 10);
      const ri = parseInt(machine_info[2], 10);
      const gi = parseInt(machine_info[3], 10);
      caseMachines.machines.push({ di, pi, ri, gi });
    }
    cases.push(caseMachines);
    i += N + 1;
  }

  return cases;
}

const cases = readInput(process.argv[2]);
let count = 1;
for (const caseMachines of cases) {
  console.log(`Case ${count}: ${caseMachines.getMaxProfit()}`);
  count += 1;
}
