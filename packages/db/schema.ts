import {
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  serial,
  pgEnum,
  decimal,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations, type InferSelectModel, type InferInsertModel } from "drizzle-orm";

// Enums
export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);
export const ticketStatusEnum = pgEnum("ticket_status", ["pending", "valid", "used", "cancelled"]);
export const orderStatusEnum = pgEnum("order_status", ["pending", "completed", "cancelled", "refunded"]);

// Users Table
export const users = pgTable(
  "users",
  {
    id: varchar("id", { length: 255 }).notNull().primaryKey(),
    name: varchar("name", { length: 255 }),
    email: varchar("email", { length: 255 }).notNull(),
    password: varchar("password", { length: 255 }), // Added password field
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: varchar("image", { length: 255 }),
    role: userRoleEnum("role").notNull().default("user"),
  },
  (users) => ({
    emailIndex: uniqueIndex("email_idx").on(users.email),
  })
);

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

export const usersRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  tickets: many(tickets),
}));

// Products Table
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  stock: integer("stock").notNull().default(0),
  imageUrl: varchar("image_url", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Product = InferSelectModel<typeof products>;
export type NewProduct = InferInsertModel<typeof products>;

export const productsRelations = relations(products, ({ many }) => ({
  orderItems: many(orderItems),
}));

// Events Table
export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  date: timestamp("date", { mode: "date" }).notNull(),
  location: varchar("location", { length: 255 }).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  imageUrl: varchar("image_url", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type Event = InferSelectModel<typeof events>;
export type NewEvent = InferInsertModel<typeof events>;

export const eventsRelations = relations(events, ({ many }) => ({
  tickets: many(tickets),
}));

// Tickets Table
export const tickets = pgTable("tickets", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id")
    .notNull()
    .references(() => events.id),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id),
  uniqueCode: varchar("unique_code", { length: 255 }).notNull(),
  status: ticketStatusEnum("status").notNull().default("pending"),
  purchaseDate: timestamp("purchase_date").defaultNow(),
});

export type Ticket = InferSelectModel<typeof tickets>;
export type NewTicket = InferInsertModel<typeof tickets>;

export const ticketsRelations = relations(tickets, ({ one }) => ({
  event: one(events, {
    fields: [tickets.eventId],
    references: [events.id],
  }),
  user: one(users, {
    fields: [tickets.userId],
    references: [users.id],
  }),
}));

// Orders Table
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: orderStatusEnum("status").notNull().default("pending"),
  orderDate: timestamp("order_date").defaultNow(),
});

export type Order = InferSelectModel<typeof orders>;
export type NewOrder = InferInsertModel<typeof orders>;

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  orderItems: many(orderItems),
}));

// Order Items Table
export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .notNull()
    .references(() => orders.id),
  productId: integer("product_id")
    .notNull()
    .references(() => products.id),
  quantity: integer("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
});

export type OrderItem = InferSelectModel<typeof orderItems>;
export type NewOrderItem = InferInsertModel<typeof orderItems>;

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
}));