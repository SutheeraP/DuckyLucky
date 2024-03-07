import Image from "next/image"
import { useEffect } from "react"
import { ref, update } from "firebase/database";

const WINNING_COMBO = [
    [0, 1, 2, 3],
    [4, 5, 6, 7],
    [8, 9, 10, 11],
    [12, 13, 14, 15],
    [0, 4, 8, 12],
    [1, 5, 9, 13],
    [2, 6, 10, 14],
    [3, 7, 11, 15],
    [0, 5, 10, 15],
    [3, 6, 9, 12]
]

const Board = (props: any) => {
    const { xTurn, won, draw, boardData, result, setXTurn, setWon, setDraw, setBoardData, setResult, reset, gameStatus, selectedCard, x, o, currentUid, player, updateBoard, roomId, db } = props;

    useEffect(() => {
        checkWinner()
        checkDraw()
    }, [boardData])

    const updateBoardData = (idx: number) => {
        if (xTurn && x == currentUid || !xTurn && o == currentUid) {
            if (!boardData[idx] && !won) {
                let value = xTurn === true ? player[x].profile_img : player[o].profile_img;
                // กดแล้วอัพเดตช่องนั้นใน db & เปลี่ยน turn
                update(ref(db, `Matching/${roomId}/board`), {
                    [idx]: value
                })
                update(ref(db, `Matching/${roomId}`), {
                    currentTurn: !xTurn
                })
                update(ref(db, `Matching/${roomId}`), {
                    time: 20
                })
            }
        }
        
        checkWinner()
    }

    const checkDraw = () => {
        let check = Object.keys(boardData).every((v) => boardData[v])
        setDraw(check)
    }

    const checkWinner = () => {
        WINNING_COMBO.map((bd) => {
            const [a, b, c, d] = bd
            if (boardData[a] && boardData[a] == boardData[b] && boardData[b] == boardData[c] && boardData[c] == boardData[d]) {
                setWon(true)
                return
            }
            setResult(!xTurn ? 'คุณชนะ !' : 'คุณแพ้ !')
        })
    }

    return (
        <div className="grid grid-cols-4 grid-rows-4 gap-2 self-center ">
            {[...Array(16)].map((v, idx: number) => {
                return <div key={idx} className={`${selectedCard === `` ? 'w-20 h-20' : 'w-12 h-12'} cursor-pointer relative flex justify-center`} onClick={gameStatus == 'Playing' ? () => { updateBoardData(idx) } : undefined}>
                    <div className="self-center text-2xl">
                        <Image className={`${boardData[idx] == `` ? `hidden` : `block`} ${(x == currentUid && boardData[idx] == player[x].profile_img) || (o == currentUid && boardData[idx] == player[o].profile_img) ? `greyscale-0`:`grayscale`}`} src={boardData[idx]} alt="" width={selectedCard === `` ? 50 : 30} height={selectedCard === `` ? 50 : 30} />
                    </div>
                    <Image src={`/image/board/grid${idx + 1}.svg`} alt="" width={80} height={80} className="absolute top-0 left-0" />
                </div>
            })}
        </div>
    )
}

export default Board;