import React from "react";

export const getJwt = () => {
    return localStorage.getItem('cool.jwt');
};