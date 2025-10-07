import { RequestInterceptor } from "../lib/api/interceptor";
import { useLoginMutation } from "../services/api";

// Example usage in a component
export const ExampleLoginComponent = () => {
  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async (email: string, password: string) => {
    await RequestInterceptor.handleRequest(
      () => login({ email, password }).unwrap(),
      {
        onSuccess: () => {
          console.log("Login successful!");
          // Navigate to dashboard or perform other success actions
        },
        onError: (error) => {
          console.error("Login failed:", error);
          // Handle specific error cases
        },
        successMessage: "Welcome back!",
        errorMessage: "Login failed. Please check your credentials.",
        showToast: true,
      },
      "LOGIN"
    );
  };

  return <div>{/* Your login form JSX */}</div>;
};

// Example for delete operations with confirmation
export const ExampleDeleteComponent = () => {
  const [deletePost] = useDeletePostMutation();

  const handleDelete = async (postId: string) => {
    await RequestInterceptor.handleRequest(
      () => deletePost(postId).unwrap(),
      {
        shouldConfirm: true,
        confirmMessage: "Are you sure you want to delete this post?",
        successMessage: "Post deleted successfully",
        errorMessage: "Failed to delete post",
        onSuccess: () => {
          // Refresh the posts list or navigate away
        },
      },
      "DELETE_POST"
    );
  };

  return <div>{/* Your delete button JSX */}</div>;
};
