import React, { useEffect, useRef, useState } from 'react'
import ChessBoard from '../../components/ChessBoard/ChessBoard';

export default function AdminPage() {
        // get categories
        const [categories, setCategories] = useState([]);
        const [fen,setFen] = useState("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1");
        const fenRef = useRef();

        useEffect(() => {
                fetch('http://localhost:5050/api/tactic/getCategories')
                .then(response => response.json())
                .then(data => {
                        setCategories(data.categories);
                })
                .catch(error => {
                        console.log(error);
                });
        }, []);

  return (
    <>
        <div>AdminPage</div>
        <br />
        <h1>Add a tactic</h1>

        <form action="http://localhost:5050/api/tactic/addTactic" method="post" className='border'>
        <table >
            <tbody>
                <tr>
                    <th>
                    <label htmlFor="titleCategory">Category Name</label>
                    </th>
                    <th>
                    <select name="titleCategory">
                        {
                                categories.map((category, index) => {
                                        return (
                                                <option key={index} value={category.name}>{category.name}</option>
                                        )
                                        }
                                )
                        }
                    </select>
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
            <input type="text" name="fen" ref={fenRef} onChange={(e)=> setFen(fenRef.current.value)} placeholder="rnbqkb1r/pp2pp1p/3p1np1/8/3NP3/2N5/PPP2PPP/R1BQKB1R w KQkq - 0 1" />
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

        <div className="w-[70%] mx-auto">
        <ChessBoard fen={fen} whiteSide={true} />
        </div>
    </>
  )
}
