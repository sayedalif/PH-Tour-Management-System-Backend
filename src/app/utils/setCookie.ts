import { Response } from "express";

interface AuthTokens {
  accessToken?: string;
  refreshToken?: string;
};


const options = {
      httpOnly: true,
      secure: false,
    };

export const setAuthCookie = (res: Response, tokenInfo: AuthTokens)=>{

  if(tokenInfo.accessToken){
    res.cookie('accessToken', tokenInfo.accessToken, options);
  }

  if(tokenInfo.refreshToken){
    res.cookie('refreshToken', tokenInfo.refreshToken, options);
  }

};