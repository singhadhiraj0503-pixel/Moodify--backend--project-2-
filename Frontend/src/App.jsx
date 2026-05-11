import "./App.css";
import FaceExpression from "./features/Expression/components/FaceExpression";
import { RouterProvider } from "react-router-dom";
import { router } from "./app.routes";
import { AuthProvider } from "./features/auth/auth.context";

function App() {
  return (
    <div>
      {/* <FaceExpression /> */}
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </div>
  );
}

export default App;
