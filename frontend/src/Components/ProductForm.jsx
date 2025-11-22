import React from "react";
export default function ProductForm({
    productName,
    brand,
    image,
    price,
    handleOnSubmit,
    handleOnChange,
    editing,
}) {
    return (
        <div>
            <h2>Product Form</h2>
            <form onSubmit={handleOnSubmit}>
                <label htmlFor="productName"></label>
                <input 
                    type="text" 
                    id="productName" 
                    name="productName" 
                    value={productName}
                    onChange={handleOnChange}
                    placeholder="name"
                    required
                /><br/>
                <label htmlFor="brand"></label>
                <input 
                    type="text" 
                    id="brand" 
                    name="brand" 
                    value={brand} 
                    onChange={handleOnChange}
                    placeholder="brand"
                    required
                /><br/>
                <label htmlFor="image"></label>
                <input 
                    type="text" 
                    id="image" 
                    name="image" 
                    value={image} 
                    onChange={handleOnChange}
                    placeholder="image url"
                    required
                /><br/>   
                <label htmlFor="price"></label>
                <input 
                    type="text" 
                    id="price" 
                    name="price"
                    value={price}
                    onChange={handleOnChange}
                    placeholder="$null"
                    required
                /><br/>
                <button>{editing?"Edit":"Add"}</button>
            </form>
        </div>
    );

}