import React from 'react';
import ReactDOM from 'react-dom/client';
import NameUser from './pages/NameUser/NameUser';
import RoomList from './pages/RoomList/RoomList';
import CreateRoom from './pages/CreateRoom/CreateRoom';
import LoadingConnection from './pages/LoadingConnection/LoadingConnection';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <NameUser />,
  },
  {
    path: "/list",
    element: <RoomList />
  },
  {
    path: "/create-room",
    element: <CreateRoom />
  },
  {
    path: "/:roomId",
    element: <LoadingConnection />,
    loader: async ({ request, params }) => {
      return fetch(
        `${process.env.REACT_APP_API}/${params.roomId}`,
      );
    },
  }
]);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
