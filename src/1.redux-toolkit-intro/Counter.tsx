import { useAppDispatch, useAppSelector } from "./app/hooks";
import { increment, decrement, incrementByAmount, reset } from "./features/counter/counter-slice";

const centeringStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1rem'
};

function Counter() {
    const count = useAppSelector((state) => state.counter.count);
    const dispatch = useAppDispatch();

  return (
    <section>
        <h1>Redux Toolkit Counter (INTRO)</h1>
        <div style={centeringStyle}>
            <button onClick={() => dispatch(decrement())}>-</button>
            <h2>{count}</h2>
            <button onClick={() => dispatch(increment())}>+</button>
        </div>
        <form onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const input = form.elements.namedItem("amount") as HTMLInputElement;
            const amount = Number(input.value);
            if (!isNaN(amount)) {
                dispatch(incrementByAmount(amount));
            }
        }} style={centeringStyle}>
            <input type="number" name="amount" style={{height: '2rem'}}/>
            <button type="submit">Add Amount</button>
        </form>
        <div style={Object.assign({margin: '1rem 0'}, centeringStyle)}>

        <button onClick={() => dispatch(reset())} >Reset 🔄</button>
        </div>
    </section>
  )
}

export default Counter