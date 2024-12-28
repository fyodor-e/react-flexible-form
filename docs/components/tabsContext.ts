"use client";
import { createContext } from "react";

export const selectedTabContext = createContext<string>("");

export const Provider = selectedTabContext.Provider;
