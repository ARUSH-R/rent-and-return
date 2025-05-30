const Unauthorized = () => {
  return (
    <div className="p-4 text-center text-red-500">
      <h2 className="text-2xl font-bold">Unauthorized</h2>
      <p>You do not have permission to view this page.</p>
    </div>
  );
};

export default Unauthorized;

<Route path="/unauthorized" element={<Unauthorized />} />
