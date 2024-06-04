import React from "react";
import { useSelector } from "react-redux";
import CartProduct from "../component/cartProduct";
import emptyCartImage from "../assest/empty.gif";
import { toast } from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate } from "react-router-dom";

const stripePromise = loadStripe("pk_test_51MpkaWSBDWHFiQ13fwpApR9ghYr5wuMFiypMZvGaasDvxOprBHN2oV8Npx8dLYlK0u4PRTvsf14bY23AR8s6gTgk00vfxFxsfj");

const Cart = () => {
  const productCartItem = useSelector((state) => state.product.cartItem);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const totalPrice = productCartItem.reduce(
    (acc, curr) => acc + parseInt(curr.total),
    0
  );
  const totalQty = productCartItem.reduce(
    (acc, curr) => acc + parseInt(curr.qty),
    0
  );

  const handlePayment = async () => {
    if (user.email) {
      try {
        const stripe = await stripePromise;

        const res = await fetch("http://localhost:8080/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: productCartItem.map((item) => ({
              name: item.name,
              price: item.price,
              quantity: item.qty,
            })),
          }),
        });

        if (res.status === 500) {
          toast.error("Server error. Please try again.");
          return;
        }

        const data = await res.json();
        toast("Redirecting to payment gateway...");

        const result = await stripe.redirectToCheckout({
          sessionId: data.url,
        });

        if (result.error) {
          toast.error(result.error.message);
        }
      } catch (error) {
        toast.error("Payment failed. Please try again.");
        console.error("Error:", error);
      }
    } else {
      toast("You are not logged in!");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    }
  };

  return (
    <>
      <div className="p-2 md:p-4">
        <h2 className="text-lg md:text-2xl font-bold text-slate-600">
          Your Cart Items
        </h2>

        {productCartItem.length > 0 ? (
          <div className="my-4 flex gap-3">
            {/* display cart items */}
            <div className="w-full max-w-3xl">
              {productCartItem.map((el) => (
                <CartProduct
                  key={el._id}
                  id={el._id}
                  name={el.name}
                  image={el.image}
                  category={el.category}
                  qty={el.qty}
                  total={el.total}
                  price={el.price}
                />
              ))}
            </div>

            {/* total cart item */}
            <div className="w-full max-w-md ml-auto">
              <h2 className="bg-blue-500 text-white p-2 text-lg">Summary</h2>
              <div className="flex w-full py-2 text-lg border-b">
                <p>Total Qty :</p>
                <p className="ml-auto w-32 font-bold">{totalQty}</p>
              </div>
              <div className="flex w-full py-2 text-lg border-b">
                <p>Total Price</p>
                <p className="ml-auto w-32 font-bold">
                  <span className="text-red-500">₹</span> {totalPrice}
                </p>
              </div>
              <button
                className="bg-red-500 w-full text-lg font-bold py-2 text-white"
                onClick={handlePayment}
              >
                Payment
              </button>
            </div>
          </div>
        ) : (
          <div className="flex w-full justify-center items-center flex-col">
            <img src={emptyCartImage} className="w-full max-w-sm" alt="Empty Cart" />
            <p className="text-slate-500 text-3xl font-bold">Empty Cart</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;