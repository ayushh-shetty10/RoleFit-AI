import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { Getme, login, logout, register } from "../services/auth.api";

export const useAuth = () => {
  const context = useContext(AuthContext);
  const { user, setUser, loading, setLoading } = context;

  
    useEffect(()=>{

        const getAndSetUser =async()=>{
            try{
            setLoading(true);
            const data = await Getme();
            setUser(data.user);
    
            }catch(err){
                console.log(err);
            }finally{
                setLoading(false);
            }
        }

        getAndSetUser();
    },[])

  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    try {
      const data = await login({
        email,
        password,
      });
      setUser(data.user);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async ({ email, username, password }) => {
    setLoading(true);
    try {
      const data = await register({
        email,
        password,
        username,
      });
      setUser(data.user);
    } catch (err) {
          console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      const data = await logout();
      setUser(null);
    } catch (err) {
          console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return { loading, user, handleLogin, handleLogout, handleRegister };
};
