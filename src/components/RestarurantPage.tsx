import React from "react";

function RestaurantPage() {
  // Example data for the restaurant
  const restaurantDetails = {
    name: "The Gourmet Kitchen",
    location: "123 Food Street, Culinary City",
    manager: "John Doe",
    email: "manager@gourmetkitchen.com",
    description:
      "A fine dining experience offering a fusion of global cuisines with a modern twist.",
  };

  return (
    <div className="restaurant-page p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        {restaurantDetails.name}
      </h1>
      <div className="restaurant-details bg-white p-4 shadow rounded">
        <p className="mb-2">
          <strong>Location:</strong> {restaurantDetails.location}
        </p>
        <p className="mb-2">
          <strong>Manager:</strong> {restaurantDetails.manager}
        </p>
        <p className="mb-2">
          <strong>Email:</strong> {restaurantDetails.email}
        </p>
        <p>
          <strong>Description:</strong> {restaurantDetails.description}
        </p>
      </div>
    </div>
  );
}

export default RestaurantPage;
