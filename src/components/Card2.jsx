import { useDispatch } from "react-redux";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IncrementQty, RemoveItem, DecrementQty } from "../redux/cartSlice";

function Card2({ name, image, price, id, qty }) {
  const dispatch = useDispatch();

  return (
    <div className="w-full h-[120px]  p-2 shadow-lg flex justify-between">
      <div className="w-[60%] h-full flex gap-5">
        <div className="w-[60%] h-full overflow-hidden rounded-lg">
          <img src={image} alt="" className="object-cover" />
        </div>

        <div className="flex flex-col w-[40%] h-full gap-3">
          <div className="text-lg text-gray-700 font-semibold">{name}</div>
          <div className="w-[110px] h-[50px] bg-slate-400 flex rounded-lg font-semibold border-2 border-green-400 overflow-hidden shadow-lg text-xl">
            <button
              onClick={() => {
                qty > 1 ? dispatch(DecrementQty(id)) : 1;
              }}
              className="w-[30%] h-full bg-white text-green-400 flex justify-center hover:bg-gray-200 cursor-pointer items-center"
            >
              -
            </button>
            <span className="w-[40%] h-full text-green-400 bg-slate-200 flex justify-center items-center">
              {qty}
            </span>
            <button
              onClick={() => {
                dispatch(IncrementQty(id));
              }}
              className="w-[30%] h-full bg-white text-green-400 flex justify-center hover:bg-gray-200 cursor-pointer items-center"
            >
              +
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-start items-end gap-6">
        <span className="text-xl text-green-400 font-semibold">
          Rs {price}/-
        </span>
        <RiDeleteBin6Line
          onClick={() => dispatch(RemoveItem(id))}
          className="w-[30px] h-[30px] text-red-400 cursor-pointer"
        />
      </div>
    </div>
  );
}

export default Card2;
