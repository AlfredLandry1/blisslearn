// import { useSession } from "next-auth/react";
// import { useEffect } from "react";
// import { useAuthStore } from "@/store/auth-store";

// export function useAuthSync() {
//   const { data: session, status } = useSession();
//   const { setUser, setIsAuthenticated, setIsLoading } = useAuthStore();

//   useEffect(() => {
//     setIsLoading(status === "loading");
    
//     if (status === "authenticated" && session?.user) {
//       setUser({
//         id: session.user.id as string,
//         email: session.user.email,
//         name: session.user.name,
//         image: session.user.image,
//       });
//       setIsAuthenticated(true);
//     } else if (status === "unauthenticated") {
//       setUser(null);
//       setIsAuthenticated(false);
//     }
//   }, [session, status, setUser, setIsAuthenticated, setIsLoading]);

//   return {
//     isLoading: status === "loading",
//     isAuthenticated: status === "authenticated",
//   };
// } 