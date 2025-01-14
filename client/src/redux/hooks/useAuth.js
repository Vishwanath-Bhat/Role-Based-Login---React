import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '../slices/authSlice';

const useAuth = () => {
    const user = useSelector((state) => state.auth.user)
    const role = useSelector((state) => state.auth.role)
    const token = useSelector((state) => state.auth.token)
    const dispatch = useDispatch();

    const UpdateUserLogin = (username,role, token) => {
    dispatch(login({ username,role, token }));
    const jwtToken = { username, role, token };
localStorage.setItem('token', JSON.stringify(jwtToken));

  };

  const UpdateUserLogout = () => {
    dispatch(logout());
    // localStorage.removeItem('token');
  };

  return { user,role, token , UpdateUserLogin, UpdateUserLogout };
};

export default useAuth;
