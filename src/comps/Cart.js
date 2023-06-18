import React, { useEffect, useState } from "react";
import Product from "./Product";
import DropIn from "braintree-web-drop-in-react";
import { getClientToken, makePayment } from "./apiCall";

const Cart = () => {
  const [cartProduct, setCartProduct] = useState([]);


  const [value, setValue]=useState({
    clientToken:null,
    success:"",
    error:'',
    instance:""
  })
  const {clientToken, success, err,instance}=value
  useEffect(() => {
    
    setCartProduct(loadCart());
   
  }, [success]);

  useEffect(()=>{
    getToken();
  }, [setCartProduct])



  const getToken=()=>{
    getClientToken().then((resp)=>{
      if(resp.err){
        setValue({...value,error:resp.err})
      }
      else{
        setValue({...value, clientToken:resp.clientToken})
      }
    })
  }




  const loadCart = () => {
    if (localStorage.getItem("cart")) {
      return JSON.parse(localStorage.getItem("cart")); //   console.log(localStorage.getItem('cart'))
    }
    return [];
  };

  const onPurchase=()=>{
    instance.requestPaymentMethod()
    .then((data)=>{
      let nonce=data.nonce;

      let paymentData={
        payment_method_nonce:nonce,
        amount:getAmount()
      }
      console.log(paymentData);

      makePayment(paymentData).then((response=>{
        console.log("RESPONSE",response);
        if(response.err){
          setValue({...value,error:response.err})
        }else{
          setValue({...value,error:"", success:response.success})
          emptyCart();

        }
      })).catch((err)=>{
        setValue({...value,error:err,success:""})
      })


    })
  }

  const emptyCart=()=>{
    if(localStorage.getItem('cart')){
      localStorage.removeItem('cart')
    }
  }

  const getAmount=()=>{
    let amount=0;
    cartProduct.map((data,i)=>{
      amount=amount+data.amount
    })
    return amount;
  }


  return (
    <div className="cart">
      <div className="cart-item">
        {cartProduct.length > 0 &&
          cartProduct.map((data, i) => (
            <Product
              key={i}
              name={data.name}
              from="cart"
              amount={data.amount}
              img={data.img}
            />
          ))}

        {cartProduct.length == 0 && <h1>Cart is Empty</h1>}
      </div>
     
      <div className="payment">
      {clientToken && <h1>TOtal Amount:{getAmount()}$</h1>}
      {clientToken && cartProduct.length>0 && (
        <div>
          <DropIn
          options={{ authorization:clientToken }}
          onInstance={(instance) => setValue({...value, instance:instance})}/>
          <button onClick={()=>onPurchase()}>Buy</button>
        </div>
      )}
      {!clientToken && <h1>Loading....</h1>}
      </div>
      
    </div>
  );
};

export default Cart;
