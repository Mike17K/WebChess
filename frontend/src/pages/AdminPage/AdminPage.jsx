import React from 'react'

export default function AdminPage() {
  return (
    <>
        <div>AdminPage</div>

        <form action="http://localhost:5050/api/tactic/addTactic" method="post">
        <table >
            <tbody>
                <tr>
                    <th>
                    <label htmlFor="titleCategory">Category Name</label>
                    </th>
                    <th>
                    <input type="text" name="titleCategory" placeholder="B21 - 2.f4" />
                    </th>
                </tr>
                <tr>
                    <th>
            <label htmlFor="title">Tactic Title</label>
                    </th>
                    <th>
            <input type="text" name="title" placeholder="test title 1" />
                    </th>
                </tr>
                <tr>
                    <th>
            <label htmlFor="fen">FEN</label>
                    </th>
                    <th>
            <input type="text" name="fen" placeholder="rnbqkb1r/pp2pp1p/3p1np1/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 1" />
                    </th>
                </tr>
                <tr>
                    <th>
            <label htmlFor="solution">Solution</label>
                    </th>
                    <th>
            <input type="text" name="solution" placeholder="7...Qa5+ 0-1" />
                    </th>
                </tr>
                <tr>
                    <th>
            <label htmlFor="comments">Comments</label>
                    </th>
                    <th>
            <input type="text" name="comments" placeholder="Black checks to capture the undefended bishop." />  
                    </th>
                </tr>
                <tr>
                    <th>
            <label htmlFor="tacticInfo">Tactic Info</label>
                    </th>
                    <th>
            <input type="text" name="tacticInfo" placeholder="Simons - Lowe, London 1849" />  
                    </th>
                </tr>
                <tr>
                    <th>
            <label htmlFor="hints">Hints</label>
                    </th>
                    <th>
            <input type="text" name="hints" placeholder="7...Q" />  
                    </th>
                </tr>

            </tbody>
        </table>
                    <button type="submit">Submit</button>
        </form>

    </>
  )
}
