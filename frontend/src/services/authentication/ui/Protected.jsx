import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router';
import { LoadingState } from '../../../components/feedback/LoadingState';

export const Protected = ({ children }) => {
  const { loading, user } = useAuth();

  if (loading) {
    return <LoadingState fullPage message="Authenticating session..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default Protected;
