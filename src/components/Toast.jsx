import React from 'react';
import './Toast.css';

function Toast(props) {
  if (!props.message) {
    return null;
  }

  return (
    <div className="toast">
      {props.message}
    </div>
  );
}

export default Toast;
