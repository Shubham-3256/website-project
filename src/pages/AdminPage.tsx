// src/pages/AdminPage.tsx
import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  image_url: string;
}

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  customer_name: string;
  customer_address: string;
  payment_method: string;
  items: OrderItem[];
  total: number;
  status: string;
  created_at: string;
  email?: string | null;
}

const AdminPage = () => {
  const { toast } = useToast();

  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    category: "main",
    description: "",
    image_url: "",
  });
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const orderStatuses = ["pending", "in process", "cancelled", "delivered"];
  const statusColors: Record<string, string> = {
    pending: "bg-yellow-200 text-yellow-800",
    "in process": "bg-blue-200 text-blue-800",
    cancelled: "bg-red-200 text-red-800",
    delivered: "bg-green-200 text-green-800",
  };

  useEffect(() => {
    fetchMenu();
    fetchOrders();
  }, []);

  const fetchMenu = async () => {
    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .order("id");
    if (error)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    else setMenu(data || []);
  };

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (error)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    else {
      const formattedOrders = (data || []).map((order: any) => ({
        id: order.id,
        customer_name: order.name,
        customer_address: order.address,
        payment_method: order.paymentMethod || "COD",
        items: order.items,
        total: order.total,
        status: order.status,
        created_at: order.created_at,
        email: order.email || null,
      }));
      setOrders(formattedOrders);
    }
  };

  const handleAdd = async () => {
    if (!newItem.name || newItem.price === "" || isNaN(Number(newItem.price)))
      return;
    const { error } = await supabase.from("menu_items").insert([
      {
        name: newItem.name,
        price: parseFloat(newItem.price),
        category: newItem.category,
        description: newItem.description,
        image_url: newItem.image_url,
      },
    ]);
    if (error)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    else {
      toast({ title: "Menu updated", description: `${newItem.name} added.` });
      setNewItem({
        name: "",
        price: "",
        category: "main",
        description: "",
        image_url: "",
      });
      fetchMenu();
    }
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("menu_items").delete().eq("id", id);
    if (error)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    else {
      toast({ title: "Deleted", description: "Menu item removed." });
      fetchMenu();
    }
  };

  const handleEdit = (item: MenuItem) => setEditingItem(item);

  const handleUpdate = async () => {
    if (!editingItem) return;
    const { error } = await supabase
      .from("menu_items")
      .update({
        name: editingItem.name,
        price: editingItem.price,
        category: editingItem.category,
        description: editingItem.description,
        image_url: editingItem.image_url,
      })
      .eq("id", editingItem.id);
    if (error)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    else {
      toast({ title: "Updated", description: "Menu item updated." });
      setEditingItem(null);
      fetchMenu();
    }
  };

  const handleStatusChange = async (
    orderId: string,
    newStatus: string,
    email?: string | null
  ) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    toast({
      title: "Order Updated",
      description: `Status changed to "${newStatus}"`,
    });
    fetchOrders();

    if (email) {
      try {
        await fetch("/api/send-order-status-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, orderId, newStatus }),
        });
      } catch (err) {
        console.error("Failed to send email:", err);
      }
    }
  };

  // Prepare data for charts
  const statusData = orders.reduce((acc: Record<string, number>, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(statusData).map(([status, value]) => ({
    name: status,
    value,
  }));

  const COLORS = ["#FBBF24", "#3B82F6", "#EF4444", "#10B981"];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Admin Dashboard</h1>

      {/* Dashboard Charts */}
      <section className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 shadow rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Order Status Overview</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Menu Management */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">📋 Menu Management</h2>
        {!editingItem && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* Row 1 */}
            <Input
              placeholder="Name"
              value={newItem.name}
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              className="w-full"
            />
            <Input
              type="number"
              placeholder="Price"
              value={newItem.price}
              onChange={(e) =>
                setNewItem({ ...newItem, price: e.target.value })
              }
              className="w-full"
            />
            <Input
              placeholder="Category"
              value={newItem.category}
              onChange={(e) =>
                setNewItem({ ...newItem, category: e.target.value })
              }
              className="w-full"
            />

            {/* Row 2 */}
            <Input
              placeholder="Description"
              value={newItem.description}
              onChange={(e) =>
                setNewItem({ ...newItem, description: e.target.value })
              }
              className="md:col-span-2 w-full"
            />
            <Input
              placeholder="Image URL"
              value={newItem.image_url}
              onChange={(e) =>
                setNewItem({ ...newItem, image_url: e.target.value })
              }
              className="w-full"
            />

            {/* Row 3: Add Button */}
            <div className="md:col-span-3 flex justify-end">
              <Button onClick={handleAdd}>Add Item</Button>
            </div>
          </motion.div>
        )}

        {editingItem && (
          <motion.div
            className="flex flex-col gap-3 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Input
              value={editingItem.name}
              onChange={(e) =>
                setEditingItem({ ...editingItem, name: e.target.value })
              }
              className="w-64"
            />
            <Input
              type="number"
              value={editingItem.price}
              onChange={(e) =>
                setEditingItem({
                  ...editingItem,
                  price: parseFloat(e.target.value),
                })
              }
              className="w-32"
            />
            <Input
              value={editingItem.description}
              onChange={(e) =>
                setEditingItem({ ...editingItem, description: e.target.value })
              }
              className="w-96"
            />
            <Input
              value={editingItem.image_url}
              onChange={(e) =>
                setEditingItem({ ...editingItem, image_url: e.target.value })
              }
              className="w-96"
            />
            <Button onClick={handleUpdate}>Update</Button>
            <Button variant="destructive" onClick={() => setEditingItem(null)}>
              Cancel
            </Button>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {menu.map((item) => (
            <motion.div
              key={item.id}
              className="bg-white shadow rounded-lg p-4 hover:shadow-lg transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-lg">
                    {item.name} ({item.category})
                  </p>
                  <p className="text-gray-600">₹{item.price}</p>
                  <p className="mt-2 text-gray-500">{item.description}</p>
                  {item.image_url && (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-32 h-32 object-cover mt-2 rounded"
                    />
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Button size="sm" onClick={() => handleEdit(item)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Orders */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">🛒 Orders</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {orders.map((order) => (
            <motion.div
              key={order.id}
              className="bg-white p-4 shadow rounded-lg hover:shadow-xl transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="font-semibold text-lg">Order #{order.id}</p>
              <p className="text-gray-700">Customer: {order.customer_name}</p>
              <p className="text-gray-700">Address: {order.customer_address}</p>
              <p className="text-gray-700">Payment: {order.payment_method}</p>
              <div className="flex items-center gap-2 my-2">
                <span>Status:</span>
                <select
                  value={order.status}
                  onChange={(e) =>
                    handleStatusChange(order.id, e.target.value, order.email)
                  }
                  className={`border p-1 rounded ${statusColors[order.status]}`}
                >
                  {orderStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <p className="font-semibold mt-2">Items:</p>
              <ul className="pl-4 list-disc text-gray-600">
                {order.items.map((i) => (
                  <li key={i.id}>
                    {i.name} x {i.quantity} - ₹{i.price * i.quantity}
                  </li>
                ))}
              </ul>
              <p className="font-bold mt-2">Total: ₹{order.total}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminPage;
