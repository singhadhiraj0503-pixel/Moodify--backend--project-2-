import "./App.css";
import FaceExpression from "./features/Expression/components/FaceExpression";
import { RouterProvider } from "react-router-dom";
import { router } from "./app.routes";
import { AuthProvider } from "./features/auth/auth.context";
import { SongContextProvider } from "./features/home/song.context";

function App() {
  return (
    <div>
      {/* <FaceExpression /> */}
      <AuthProvider>
        <SongContextProvider>
          <RouterProvider router={router} />
        </SongContextProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
