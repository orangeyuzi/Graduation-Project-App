import { Text } from "react-native-paper";
import Template from "../Template";
import React from "react";
export default ({scrollY}:any) => { 
    return (<>
    <Template kind={'recent'} scrollY={scrollY}/>
    
    </>)
}