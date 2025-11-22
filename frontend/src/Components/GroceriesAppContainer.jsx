import React from "react";
import { useState, useEffect } from "react";
import CartContainer from "./CartContainer";
import ProductForm from "./ProductForm";
import ProductsContainer from "./ProductsContainer";
import NavBar from "./NavBar";
import axios from "axios";

export default function GroceriesAppContainer({ products }) {
  //states
  const [productsData, setProductsData] = useState([]);
  const [cartList, setCartList] = useState([]);
  const [productQuantity, setProductQuantity] = useState([]);
  const [formData, setFormData] = useState({
    productName: "",
    brand: "",
    image: "",
    price: "",
  });
  const [editing, setEditing] = useState(false);
  const [postResponse, setPostResponse] = useState("");
  
  //retrieve
  const handleProductsDB = async () => {
    try {
      const response = await axios.get("http://localhost:3000/groceryProduct");
      
      console.log(response.data); 
      
      setProductsData(response.data);
      //set quantity
      setProductQuantity(
        response.data.map((product) => ({ id: product.id, quantity: 0 }))
      );
    }catch(error){
      console.error(error.message);
    }
  };

  //useEffect
  useEffect(() =>{
    handleProductsDB();
  }, []);

  const handleAddQuantity = (productId, mode) => {
    if (mode === "cart") {
      const newCartList = cartList.map((product) => {
        if (product.id === productId) {
          return { ...product, quantity: product.quantity + 1 };
        }
        return product;
      });
      setCartList(newCartList);
      return;
    } else if (mode === "product") {
      const newProductQuantity = productQuantity.map((product) => {
        if (product.id === productId) {
          return { ...product, quantity: product.quantity + 1 };
        }
        return product;
      });
      setProductQuantity(newProductQuantity);
      return;
    }
  };

  const handleResetForm = () => {
    setFormData({
      productName: "",
      brand: "",
      image: "",
      price: "",
    });
  };


  const handleEdit = async (id) => {
    try{
      const editProduct = await axios.get(`http://localhost:3000/groceryProduct/${id}`);
      
      setFormData({ 
        productName: editProduct.data.productName,
        brand: editProduct.data.brand,
        image: editProduct.data.image,
        price: editProduct.data.price,
        _id: editProduct.data._id
      });
      setEditing(true);
    }catch(error){
      console.log(error.message);
    }
  };

  
  const handleOnUpdate = async (id) => {
    try{
      const result = await axios.patch(`http://localhost:3000/groceryProduct/${id}`, formData);
      setPostResponse(result.data.message);
    }catch(error){
      console.log(error.message);
    }
  };


  const handleRemoveQuantity = (productId, mode) => {
    if (mode === "cart") {
      const newCartList = cartList.map((product) => {
        if (product.id === productId && product.quantity > 1) {
          return { ...product, quantity: product.quantity - 1 };
        }
        return product;
      });
      setCartList(newCartList);
      return;
    } else if (mode === "product") {
      const newProductQuantity = productQuantity.map((product) => {
        if (product.id === productId && product.quantity > 0) {
          return { ...product, quantity: product.quantity - 1 };
        }
        return product;
      });
      setProductQuantity(newProductQuantity);
      return;
    }
  };

  const handleAddToCart = (productId) => {
    const product = productsData.find((product) => product.id === productId);
    const pQuantity = productQuantity.find(
      (product) => product.id === productId
    );
    const newCartList = [...cartList];
    const productInCart = newCartList.find(
      (product) => product.id === productId
    );
    if (productInCart) {
      productInCart.quantity += pQuantity.quantity;
    } else if (pQuantity.quantity === 0) {
      alert(`Quantity: ${product.productName}`);
    } else {
      newCartList.push({ ...product, quantity: pQuantity.quantity });
    }
    setCartList(newCartList);
  };

  const handleProductDelete = async (id) => {
    try{
      const response = await axios.delete(`http://localhost:3000/groceryProduct/${id}`);
      setPostResponse(response.data.message);
      console.log(response)
    }catch(error){
      console.log(error.message);
    }
  };

  const handleRemoveFromCart = (productId) => {
    const newCartList = cartList.filter((product) => product.id !== productId);
    setCartList(newCartList);
  };

  const handleClearCart = () => {
    setCartList([]);
  };

  
  const handleOnSubmit = async (e) => {
    e.preventDefault(); 
    try {
      if(editing){
        handleOnUpdate(formData._id);
        handleResetForm();
        setEditing(false);
      }else{
        await axios
        .post("http://localhost:3000/groceryProduct", formData)
        .then((response) => setPostResponse(response.data.message))
        .then(()=> handleResetForm());

      }
    }catch(error) {
      console.log(error.message);
    }
  };

  const handleOnChange = (e) => {
    setFormData((prevData) => {
      return { ...prevData, [e.target.name]: e.target.value };
    });
  };


  return (
    <div>
      <NavBar quantity={cartList.length} />
      <div className="GroceriesApp-Container">
        <div className="Form">
        <ProductForm
          productName={formData.productName}
          brand={formData.brand}
          image={formData.image}
          price={formData.price}
          handleOnSubmit={handleOnSubmit}
          handleOnChange={handleOnChange}
          editing={editing}
        />
        <p>{postResponse}</p>
        </div>
        <ProductsContainer
          products={productsData}
          handleAddQuantity={handleAddQuantity}
          handleRemoveQuantity={handleRemoveQuantity}
          handleAddToCart={handleAddToCart}
          productQuantity={productQuantity}
        />
        <CartContainer
          cartList={cartList}
          handleRemoveFromCart={handleRemoveFromCart}
          handleAddQuantity={handleAddQuantity}
          handleRemoveQuantity={handleRemoveQuantity}
          handleClearCart={handleClearCart}
        />
      </div>
    </div>
  );
}
