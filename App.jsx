import React, { useState } from "react";
import { supabase, isSupabaseConfigured } from "./lib/supabase";
import {
  Plane,
  Search,
  Calendar,
  Users,
  ArrowLeftRight,
  X,
  Check,
  MapPin,
  Mail,
  Phone,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Moon,
  Eye,
  EyeOff,
  ShieldCheck,
  Headphones,
  Tag,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  PlaneTakeoff,
  Users2,
  FileText,
  Settings,
  LogOut,
  Pencil,
  Trash2,
  Plus,
  Download,
  Send,
  CreditCard,
  Wallet,
  Building2,
  Landmark,
  Triangle,
  Clock,
  User,
  Lock,
  Ticket,
  BadgeCheck,
  ArrowRight,
  Globe2,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";

/* =========================================================
   Design tokens
========================================================= */
const C = {
  navy: "#0B1E3D",
  navy2: "#132A54",
  blue: "#1D6FEF",
  blueDark: "#154FC0",
  bg: "#F4F6FA",
  card: "#FFFFFF",
  text: "#16233B",
  sub: "#6B7280",
  border: "#E6EAF2",
  success: "#16A34A",
  danger: "#DC2626",
  warn: "#D97706",
};

const AIRLINES = {
  badr: { name: "بدر للطيران", color: "#E4572E" },
  tarco: { name: "تاركو للطيران", color: "#1E9E6C" },
  sudanair: { name: "الخطوط الجوية السودانية", color: "#6E4CA0" },
};

const FONT_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;900&family=IBM+Plex+Mono:wght@500;600&display=swap');";

const CITY_CODE = {
  الخرطوم: "KRT",
  بورتسودان: "PZU",
  نيالا: "UYL",
  الأبيض: "EBD",
  كسلا: "RSS",
  جوبا: "JUB",
  دبي: "DXB",
  جدة: "JED",
  القاهرة: "CAI",
  الرياض: "RUH",
  إسطنبول: "IST",
};
const CITIES = Object.keys(CITY_CODE);

const FLIGHTS = [
  { id: "BJ101", airline: "badr", from: "الخرطوم", to: "بورتسودان", dep: "07:00", arr: "08:15", dur: "1س 15د", price: 85, aircraft: "Embraer 145", status: "نشطة" },
  { id: "SD202", airline: "sudanair", from: "الخرطوم", to: "جدة", dep: "09:30", arr: "12:10", dur: "2س 40د", price: 310, aircraft: "Airbus A320", status: "نشطة" },
  { id: "TC303", airline: "tarco", from: "الخرطوم", to: "نيالا", dep: "06:45", arr: "08:00", dur: "1س 15د", price: 95, aircraft: "ATR 72", status: "نشطة" },
  { id: "BJ104", airline: "badr", from: "بورتسودان", to: "الخرطوم", dep: "14:00", arr: "15:15", dur: "1س 15د", price: 85, aircraft: "Embraer 145", status: "نشطة" },
  { id: "SD205", airline: "sudanair", from: "الخرطوم", to: "دبي", dep: "23:15", arr: "04:40", dur: "4س 25د", price: 420, aircraft: "Airbus A320", status: "نشطة" },
  { id: "TC306", airline: "tarco", from: "الخرطوم", to: "جوبا", dep: "10:00", arr: "12:30", dur: "2س 30د", price: 260, aircraft: "Boeing 737", status: "مكتملة" },
  { id: "BJ108", airline: "badr", from: "الخرطوم", to: "الأبيض", dep: "08:00", arr: "09:00", dur: "1س 00د", price: 70, aircraft: "Embraer 145", status: "نشطة" },
  { id: "SD210", airline: "sudanair", from: "الخرطوم", to: "القاهرة", dep: "13:00", arr: "15:45", dur: "2س 45د", price: 290, aircraft: "Airbus A320", status: "نشطة" },
  { id: "TC312", airline: "tarco", from: "الخرطوم", to: "كسلا", dep: "07:30", arr: "08:35", dur: "1س 05د", price: 75, aircraft: "ATR 72", status: "ملغاة" },
  { id: "BJ115", airline: "badr", from: "الخرطوم", to: "جدة", dep: "16:00", arr: "18:35", dur: "2س 35د", price: 300, aircraft: "Boeing 737", status: "نشطة" },
  { id: "SD220", airline: "sudanair", from: "الخرطوم", to: "الرياض", dep: "05:00", arr: "07:50", dur: "2س 50د", price: 335, aircraft: "Airbus A320", status: "نشطة" },
  { id: "TC320", airline: "tarco", from: "الخرطوم", to: "إسطنبول", dep: "01:20", arr: "06:10", dur: "4س 50د", price: 410, aircraft: "Boeing 737", status: "نشطة" },
  { id: "BJ120", airline: "badr", from: "نيالا", to: "الخرطوم", dep: "09:15", arr: "10:30", dur: "1س 15د", price: 95, aircraft: "Embraer 145", status: "نشطة" },
  { id: "SD225", airline: "sudanair", from: "جوبا", to: "الخرطوم", dep: "13:40", arr: "16:00", dur: "2س 20د", price: 255, aircraft: "Boeing 737", status: "نشطة" },
  { id: "TC330", airline: "tarco", from: "بورتسودان", to: "جدة", dep: "11:00", arr: "12:30", dur: "1س 30د", price: 180, aircraft: "ATR 72", status: "نشطة" },
  { id: "BJ130", airline: "badr", from: "كسلا", to: "الخرطوم", dep: "17:00", arr: "18:05", dur: "1س 05د", price: 75, aircraft: "Embraer 145", status: "نشطة" },
];

const DESTINATIONS = [
  { city: "لندن", country: "المملكة المتحدة", price: 650, icon: Landmark, from: "#2C3E67", to: "#0B1E3D" },
  { city: "دبي", country: "الإمارات العربية المتحدة", price: 450, icon: Building2, from: "#1D6FEF", to: "#0B1E3D" },
  { city: "إسطنبول", country: "تركيا", price: 350, icon: Landmark, from: "#6E4CA0", to: "#0B1E3D" },
  { city: "القاهرة", country: "مصر", price: 250, icon: Triangle, from: "#C98A2C", to: "#0B1E3D" },
  { city: "الدوحة", country: "قطر", price: 400, icon: Building2, from: "#1E9E6C", to: "#0B1E3D" },
];

const ADMIN_USERS = [
  { name: "Admin User", email: "admin@skysudan.com", role: "مسؤول", status: "نشط" },
  { name: "Ahmed User", email: "ahmed.user@example.com", role: "مستخدم", status: "نشط" },
  { name: "Sara User", email: "sara.user@example.com", role: "مستخدم", status: "نشط" },
  { name: "Mahmoud User", email: "mahmoud.user@example.com", role: "مستخدم", status: "موقوف" },
];

const ADMIN_PASSENGERS = [
  { name: "Ahmed Mohamed", nationality: "السودانية", passport: "P1234567", dob: "1990-05-20" },
  { name: "Sara Ali", nationality: "السودانية", passport: "P2345678", dob: "1992-08-11" },
  { name: "Omar Hassan", nationality: "السودانية", passport: "P3456789", dob: "1988-02-13" },
  { name: "Nada Ibrahim", nationality: "السودانية", passport: "P4567890", dob: "1995-12-30" },
];

const ADMIN_BOOKINGS = [
  { pnr: "SSX72", passenger: "Ahmed Mohamed", route: "KRT → DXB", date: "2026-06-15", status: "مؤكد" },
  { pnr: "SSK41", passenger: "Sara Ali", route: "KRT → JED", date: "2026-06-18", status: "مؤكد" },
  { pnr: "SSP09", passenger: "Omar Hassan", route: "KRT → CAI", date: "2026-06-20", status: "معلق" },
  { pnr: "SSM55", passenger: "Nada Ibrahim", route: "PZU → JED", date: "2026-06-22", status: "ملغاة" },
];

const WEEKLY_BOOKINGS = [
  { day: "٩ مايو", value: 30 },
  { day: "١٢ مايو", value: 45 },
  { day: "١٥ مايو", value: 38 },
  { day: "١٨ مايو", value: 60 },
  { day: "٢١ مايو", value: 52 },
  { day: "٢٤ مايو", value: 70 },
  { day: "أخر ٧ أيام", value: 65 },
];

const MONTHLY_REVENUE = [
  { month: "يناير", value: 32000 },
  { month: "فبراير", value: 41000 },
  { month: "مارس", value: 38000 },
  { month: "أبريل", value: 52000 },
  { month: "مايو", value: 47000 },
  { month: "يونيو", value: 60000 },
];

const DEST_SHARE = [
  { name: "دبي", value: 35, color: C.blue },
  { name: "القاهرة", value: 25, color: "#6E4CA0" },
  { name: "جدة", value: 20, color: "#1E9E6C" },
  { name: "الدوحة", value: 12, color: "#D97706" },
  { name: "أخرى", value: 8, color: "#9CA3AF" },
];

const ROWS = 15;
const COLS = ["A", "B", "C", "D", "E", "F"];

function seatTaken(flightId, seatCode) {
  let h = 0;
  const s = flightId + seatCode;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 997;
  return h % 100 < 32;
}
function airline(id) {
  return AIRLINES[id];
}
function makePNR(seed) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 90000;
  return "SS" + (10000 + h);
}

/* =========================================================
   طبقة API — قاعدة بيانات حقيقية فقط (Supabase/PostgreSQL) (ملف .env فيه القيم)
   بتتعامل مع قاعدة بيانات حقيقية. لو لسه ما ظبطتش .env،
   لا يوجد دخول أو حفظ تجريبي في إصدار Production؛ يلزم ربط قاعدة البيانات.
========================================================= */
let _flightsDB = FLIGHTS.map((f) => ({ ...f }));
let _usersDB = ADMIN_USERS.map((u) => ({ ...u, id: u.email }));
let _passengersDB = ADMIN_PASSENGERS.map((p) => ({ ...p, id: p.passport }));
let _bookingsDB = ADMIN_BOOKINGS.map((b) => ({ ...b }));

function delay(ms = 350) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function newId(prefix) {
  return prefix + Math.floor(1000 + Math.random() * 8999);
}

function requireProductionDatabase() {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Sky Sudan غير مربوط بقاعدة البيانات الحقيقية. أكمل إعداد ملف .env أولاً.");
  }
}

const api = {
  async listFlights() {
    requireProductionDatabase();
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from("flights").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data.map((f) => ({ ...f, from: f.from, to: f.to }));
    }
    await delay();
    return [..._flightsDB];
  },
  async searchFlights(origin, destination) {
    requireProductionDatabase();
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from("flights").select("*").eq("from", origin).eq("to", destination);
      if (error) throw error;
      return data;
    }
    await delay();
    return _flightsDB.filter((f) => f.from === origin && f.to === destination);
  },
  async createFlight(data) {
    requireProductionDatabase();
    const flight = { ...data, id: data.id || newId("SS") };
    if (isSupabaseConfigured) {
      const { error } = await supabase.from("flights").insert(flight);
      if (error) throw error;
      return flight;
    }
    await delay();
    _flightsDB = [flight, ..._flightsDB];
    return flight;
  },
  async updateFlight(id, data) {
    requireProductionDatabase();
    if (isSupabaseConfigured) {
      const { error } = await supabase.from("flights").update(data).eq("id", id);
      if (error) throw error;
      return { id, ...data };
    }
    await delay();
    _flightsDB = _flightsDB.map((f) => (f.id === id ? { ...f, ...data } : f));
    return _flightsDB.find((f) => f.id === id);
  },
  async deleteFlight(id) {
    requireProductionDatabase();
    if (isSupabaseConfigured) {
      const { error } = await supabase.from("flights").delete().eq("id", id);
      if (error) throw error;
      return true;
    }
    await delay();
    _flightsDB = _flightsDB.filter((f) => f.id !== id);
    return true;
  },

  // ملحوظة: إضافة مستخدم جديد من لوحة الإدارة مش بتنشئ حساب دخول حقيقي —
  // إنشاء الحسابات بيتم فقط من صفحة "إنشاء حساب" (auth.signUp). هنا بس
  // بتقدر تعدّل الدور/الحالة أو تحذف بروفايل موجود.
  async listUsers() {
    requireProductionDatabase();
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data.map((u) => ({ ...u, name: u.name || u.email }));
    }
    await delay();
    return [..._usersDB];
  },
  async updateUser(id, data) {
    requireProductionDatabase();
    if (isSupabaseConfigured) {
      const { error } = await supabase.from("profiles").update(data).eq("id", id);
      if (error) throw error;
      return { id, ...data };
    }
    await delay();
    _usersDB = _usersDB.map((u) => (u.id === id ? { ...u, ...data } : u));
    return _usersDB.find((u) => u.id === id);
  },
  async deleteUser(id) {
    requireProductionDatabase();
    if (isSupabaseConfigured) {
      const { error } = await supabase.from("profiles").delete().eq("id", id);
      if (error) throw error;
      return true;
    }
    await delay();
    _usersDB = _usersDB.filter((u) => u.id !== id);
    return true;
  },

  async listPassengers() {
    requireProductionDatabase();
    if (isSupabaseConfigured) {
      const { data, error } = await supabase.from("passengers").select("*").order("id", { ascending: false });
      if (error) throw error;
      return data.map((p) => ({ id: p.id, name: `${p.first_name} ${p.last_name}`.trim(), nationality: p.nationality, passport: p.passport, dob: p.dob }));
    }
    await delay();
    return [..._passengersDB];
  },
  async deletePassenger(id) {
    requireProductionDatabase();
    if (isSupabaseConfigured) {
      const { error } = await supabase.from("passengers").delete().eq("id", id);
      if (error) throw error;
      return true;
    }
    await delay();
    _passengersDB = _passengersDB.filter((p) => p.id !== id);
    return true;
  },

  async listBookings() {
    requireProductionDatabase();
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from("bookings")
        .select("pnr, status, created_at, flights(from, to), passengers(first_name, last_name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data.map((b) => ({
        pnr: b.pnr,
        status: b.status,
        date: (b.created_at || "").slice(0, 10),
        route: b.flights ? `${CITY_CODE[b.flights.from] || b.flights.from} → ${CITY_CODE[b.flights.to] || b.flights.to}` : "—",
        passenger: b.passengers?.[0] ? `${b.passengers[0].first_name} ${b.passengers[0].last_name}`.trim() : "—",
      }));
    }
    await delay();
    return [..._bookingsDB];
  },
  async createBooking({ flight, seats, forms, pnr, userId, total }) {
    if (isSupabaseConfigured) {
      const { error: bErr } = await supabase
        .from("bookings")
        .insert({ pnr, user_id: userId, flight_id: flight.id, seats, status: "مؤكد", total });
      if (bErr) throw bErr;
      const rows = forms.map((f) => ({
        booking_pnr: pnr,
        first_name: f.first,
        last_name: f.last,
        dob: f.dob || null,
        nationality: f.nationality,
        passport: f.passport,
        passport_exp: f.passportExp || null,
      }));
      if (rows.length) {
        const { error: pErr } = await supabase.from("passengers").insert(rows);
        if (pErr) throw pErr;
      }
      return { pnr };
    }
    await delay();
    const b = { pnr, passenger: `${forms[0]?.first || ""} ${forms[0]?.last || ""}`.trim(), route: `${CITY_CODE[flight.from]} → ${CITY_CODE[flight.to]}`, date: flight.dep, status: "مؤكد" };
    _bookingsDB = [b, ..._bookingsDB];
    return b;
  },
  async updateBooking(pnr, data) {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from("bookings").update(data).eq("pnr", pnr);
      if (error) throw error;
      return { pnr, ...data };
    }
    await delay();
    _bookingsDB = _bookingsDB.map((b) => (b.pnr === pnr ? { ...b, ...data } : b));
    return _bookingsDB.find((b) => b.pnr === pnr);
  },
  async deleteBooking(pnr) {
    if (isSupabaseConfigured) {
      const { error } = await supabase.from("bookings").delete().eq("pnr", pnr);
      if (error) throw error;
      return true;
    }
    await delay();
    _bookingsDB = _bookingsDB.filter((b) => b.pnr !== pnr);
    return true;
  },

  // حجوزات مستخدم معيّن (بتتعرض في لوحة المستخدم)
  async listMyBookings(userId) {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from("bookings")
        .select("pnr, status, total, created_at, flights(id, from, to, dep, arr)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data.map((b) => ({
        pnr: b.pnr,
        status: b.status,
        total: b.total,
        route: b.flights ? `${CITY_CODE[b.flights.from] || b.flights.from} → ${CITY_CODE[b.flights.to] || b.flights.to}` : "—",
        date: b.flights?.dep || "",
      }));
    }
    return null; // في وضع البيانات التجريبية بنستخدم myBooking المحلي بدل كده
  },
};

/* =========================================================
   طبقة تسجيل الدخول / إنشاء الحساب — Supabase Auth الحقيقي
   لو .env مش متظبط، بترجع خطأ واضح بدل ما تكسر التطبيق.
========================================================= */
const auth = {
  async signUp(name, email, password) {
    if (!isSupabaseConfigured) throw new Error("قاعدة البيانات مش متظبطة بعد — شوف ملف .env.example");
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) throw error;
    return data.user;
  },
  async signIn(email, password) {
    if (!isSupabaseConfigured) throw new Error("قاعدة البيانات مش متظبطة بعد — شوف ملف .env.example");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data.user;
  },
  async signOut() {
    if (isSupabaseConfigured) await supabase.auth.signOut();
  },
  async getProfile(userId) {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();
    if (error) throw error;
    return data;
  },
};

/* =========================================================
   Small shared atoms
========================================================= */
function WingMark({ color = C.navy, size = 34 }) {
  return (
    <svg width={size} height={size * 0.72} viewBox="0 0 64 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M2 34C14 28 24 18 30 4c1.4 12 6 20 14 24-9 1-15 5-19 13-3-8-12-13-23-7Z"
        fill={color}
      />
      <path
        d="M20 40c9-2 16-6 20-13 3 6 9 9 17 8-6 4-9 9-10 16-4-6-15-9-27-11Z"
        fill={color}
        opacity="0.55"
      />
    </svg>
  );
}

function Logo({ light }) {
  return (
    <div className="flex items-center gap-2.5">
      <WingMark color={light ? "#FFFFFF" : C.navy} />
      <div>
        <div
          className="text-lg font-black leading-none tracking-wide"
          style={{ color: light ? "#fff" : C.navy, fontFamily: "Tajawal" }}
        >
          SKY SUDAN
        </div>
        <div className="text-[11px] leading-none mt-0.5" style={{ color: light ? "#9FB3D9" : C.sub }}>
          سكاي سودان للطيران
        </div>
      </div>
    </div>
  );
}

function StatusPill({ status }) {
  const map = {
    مؤكد: { bg: "#DCFCE7", fg: C.success },
    نشط: { bg: "#DCFCE7", fg: C.success },
    نشطة: { bg: "#DCFCE7", fg: C.success },
    معلق: { bg: "#FEF3C7", fg: C.warn },
    موقوف: { bg: "#FEF3C7", fg: C.warn },
    ملغاة: { bg: "#FEE2E2", fg: C.danger },
    مكتملة: { bg: "#E5E7EB", fg: "#4B5563" },
  };
  const s = map[status] || map["نشط"];
  return (
    <span
      className="text-xs font-bold px-2.5 py-1 rounded-full"
      style={{ background: s.bg, color: s.fg, fontFamily: "Tajawal" }}
    >
      {status}
    </span>
  );
}

function AirlineBadge({ id }) {
  const a = airline(id);
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full text-xs font-bold px-2.5 py-1"
      style={{ background: a.color + "1A", color: a.color, fontFamily: "Tajawal" }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: a.color }} />
      تشغيل: {a.name}
    </span>
  );
}

function StepIndicator({ step }) {
  const steps = ["تفاصيل الرحلة", "المقاعد", "بيانات المسافر", "الدفع", "التذكرة"];
  return (
    <div className="flex items-center justify-center gap-2 flex-wrap mb-6">
      {steps.map((s, i) => (
        <React.Fragment key={s}>
          <div className="flex items-center gap-1.5">
            <span
              className="h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-bold"
              style={{
                background: i <= step ? C.blue : "#E5E9F2",
                color: i <= step ? "#fff" : C.sub,
                fontFamily: "IBM Plex Mono",
              }}
            >
              {i + 1}
            </span>
            <span className="text-xs font-bold hidden sm:inline" style={{ color: i <= step ? C.navy : C.sub }}>
              {s}
            </span>
          </div>
          {i < steps.length - 1 && <span className="w-4 sm:w-8 h-px" style={{ background: C.border }} />}
        </React.Fragment>
      ))}
    </div>
  );
}

function Toast({ text }) {
  if (!text) return null;
  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] px-5 py-3 rounded-full text-sm font-bold shadow-xl text-white"
      style={{ background: C.navy, fontFamily: "Tajawal" }}
    >
      {text}
    </div>
  );
}

function Modal({ title, onClose, children, wide }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(11,30,61,0.55)" }}>
      <div className={"bg-white rounded-2xl w-full max-h-[90vh] overflow-y-auto " + (wide ? "max-w-lg" : "max-w-md")}>
        <div className="flex items-center justify-between px-5 py-4 border-b sticky top-0 bg-white" style={{ borderColor: C.border }}>
          <div className="font-black" style={{ fontFamily: "Tajawal", color: C.navy }}>{title}</div>
          <button onClick={onClose}>
            <X className="h-5 w-5" style={{ color: C.sub }} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div>
      <label className="text-xs font-bold" style={{ color: C.navy }}>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border rounded-lg px-3 py-2 text-sm outline-none bg-white"
        style={{ borderColor: C.border, fontFamily: "Tajawal" }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function CloudLayer({ bottom = 0 }) {
  const puffs = [
    { l: "2%", w: 180, h: 60, o: 0.5 },
    { l: "18%", w: 240, h: 80, o: 0.65 },
    { l: "38%", w: 200, h: 55, o: 0.4 },
    { l: "55%", w: 260, h: 85, o: 0.6 },
    { l: "74%", w: 190, h: 60, o: 0.45 },
    { l: "90%", w: 150, h: 50, o: 0.55 },
  ];
  return (
    <div className="absolute inset-x-0 pointer-events-none" style={{ bottom }}>
      {puffs.map((p, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: p.l,
            width: p.w,
            height: p.h,
            background: "#FFFFFF",
            opacity: p.o,
            filter: "blur(18px)",
            bottom: (i % 2) * 14,
          }}
        />
      ))}
    </div>
  );
}

function QRPattern({ seed }) {
  const cells = [];
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 9973;
  for (let i = 0; i < 64; i++) {
    h = (h * 1103515245 + 12345) % 2147483647;
    cells.push(h % 3 === 0);
  }
  return (
    <div className="grid grid-cols-8 gap-0.5 h-24 w-24 p-1.5 bg-white rounded-lg border" style={{ borderColor: C.border }}>
      {cells.map((on, i) => (
        <span key={i} style={{ background: on ? C.navy : "transparent" }} />
      ))}
    </div>
  );
}

/* =========================================================
   Public marketing bits (home page)
========================================================= */
function ChevronDownMini() {
  return <ChevronRight className="h-3 w-3 rotate-90" />;
}
function TopUtilityBar() {
  return (
    <div className="hidden sm:flex items-center justify-between px-6 py-2 text-xs" style={{ background: "#060F22", color: "#9FB3D9" }}>
      <div className="flex items-center gap-5">
        <span className="flex items-center gap-1.5">
          <Mail className="h-3.5 w-3.5" /> help@skysudan.com
        </span>
        <span className="flex items-center gap-1.5">
          <Phone className="h-3.5 w-3.5" /> +249 123 456 789
        </span>
      </div>
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1">السودان (العربية) <ChevronDownMini /></span>
        <span className="flex items-center gap-3">
          <Facebook className="h-3.5 w-3.5" />
          <Twitter className="h-3.5 w-3.5" />
          <Instagram className="h-3.5 w-3.5" />
          <Youtube className="h-3.5 w-3.5" />
        </span>
      </div>
    </div>
  );
}

function MainNav({ go }) {
  const links = ["الرئيسية", "اتصل بنا", "معلومات السفر", "الوجهات", "عروضنا", "إدارة الحجوزات"];
  return (
    <div className="flex items-center justify-between px-6 py-3.5 bg-white border-b" style={{ borderColor: C.border }}>
      <Logo />
      <nav className="hidden lg:flex items-center gap-6 text-sm font-bold" style={{ color: C.text, fontFamily: "Tajawal" }}>
        {links.map((l, i) => (
          <a key={l} className={i === 0 ? "pb-1 border-b-2" : "opacity-70 hover:opacity-100"} style={i === 0 ? { borderColor: C.blue, color: C.blue } : {}}>
            {l}
          </a>
        ))}
      </nav>
      <div className="flex items-center gap-2.5">
        <button className="h-9 w-9 rounded-full border flex items-center justify-center" style={{ borderColor: C.border }}>
          <Moon className="h-4 w-4" style={{ color: C.navy }} />
        </button>
        <button
          onClick={() => go("login")}
          className="text-sm font-bold px-4 py-2 rounded-full border-2"
          style={{ borderColor: C.blue, color: C.blue, fontFamily: "Tajawal" }}
        >
          تسجيل الدخول
        </button>
        <button
          onClick={() => go("login", "signup")}
          className="hidden sm:block text-sm font-bold px-4 py-2 rounded-full text-white"
          style={{ background: C.blue, fontFamily: "Tajawal" }}
        >
          إنشاء حساب
        </button>
      </div>
    </div>
  );
}

function Field({ label, icon: Icon, children }) {
  return (
    <div className="border rounded-xl px-3 py-2" style={{ borderColor: C.border }}>
      <label className="text-[11px] font-bold flex items-center gap-1" style={{ color: C.sub }}>
        <Icon className="h-3 w-3" /> {label}
      </label>
      <div className="mt-0.5">{children}</div>
    </div>
  );
}

function SearchWidget({ state, setState, onSearch }) {
  const { tripType, origin, destination, depDate, retDate, pax } = state;
  const tabs = [
    { id: "roundtrip", label: "رحلة ذهاب وعودة", icon: ArrowLeftRight },
    { id: "oneway", label: "ذهاب فقط", icon: Plane },
    { id: "multi", label: "وجهات متعددة", icon: Globe2 },
  ];
  return (
    <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ background: C.navy }}>
      <div className="flex">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setState((s) => ({ ...s, tripType: t.id }))}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-bold px-4 sm:px-5 py-3"
            style={{
              background: tripType === t.id ? C.blue : "transparent",
              color: tripType === t.id ? "#fff" : "#B9C6E0",
              fontFamily: "Tajawal",
            }}
          >
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>
      <div className="bg-white p-4 sm:p-5">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <Field label="من" icon={MapPin}>
            <select
              className="w-full bg-transparent font-bold outline-none"
              value={origin}
              onChange={(e) => setState((s) => ({ ...s, origin: e.target.value }))}
              style={{ fontFamily: "Tajawal" }}
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="إلى" icon={MapPin}>
            <select
              className="w-full bg-transparent font-bold outline-none"
              value={destination}
              onChange={(e) => setState((s) => ({ ...s, destination: e.target.value }))}
              style={{ fontFamily: "Tajawal" }}
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="تاريخ المغادرة" icon={Calendar}>
            <input
              type="date"
              className="w-full bg-transparent font-bold outline-none"
              value={depDate}
              onChange={(e) => setState((s) => ({ ...s, depDate: e.target.value }))}
              style={{ fontFamily: "IBM Plex Mono" }}
            />
          </Field>
          {tripType === "roundtrip" ? (
            <Field label="تاريخ العودة" icon={Calendar}>
              <input
                type="date"
                className="w-full bg-transparent font-bold outline-none"
                value={retDate}
                onChange={(e) => setState((s) => ({ ...s, retDate: e.target.value }))}
                style={{ fontFamily: "IBM Plex Mono" }}
              />
            </Field>
          ) : (
            <Field label="ملاحظة" icon={Clock}>
              <span className="text-sm opacity-50 font-bold">
                {tripType === "oneway" ? "بلا تاريخ عودة" : "قريبًا"}
              </span>
            </Field>
          )}
          <Field label="المسافرون" icon={Users}>
            <input
              type="number"
              min={1}
              max={6}
              className="w-full bg-transparent font-bold outline-none"
              value={pax}
              onChange={(e) => setState((s) => ({ ...s, pax: Math.max(1, Math.min(6, Number(e.target.value) || 1)) }))}
              style={{ fontFamily: "IBM Plex Mono" }}
            />
          </Field>
        </div>
        <button
          onClick={onSearch}
          className="mt-4 w-full sm:w-auto float-left flex items-center gap-2 font-extrabold px-8 py-3 rounded-xl text-white"
          style={{ background: C.blue, fontFamily: "Tajawal" }}
        >
          <Search className="h-4 w-4" /> البحث عن رحلات
        </button>
        <div className="clear-both" />
      </div>
    </div>
  );
}

/* =========================================================
   HOME
========================================================= */
function HomeView({ go, search, setSearch, onSearch }) {
  return (
    <div>
      <TopUtilityBar />
      <MainNav go={go} />

      <section
        style={{ background: `linear-gradient(115deg, ${C.navy} 0%, #1B3B6E 45%, #B9762F 100%)` }}
        className="relative overflow-hidden"
      >
        <CloudLayer bottom={40} />
        <div className="max-w-6xl mx-auto px-6 pt-14 pb-24 grid lg:grid-cols-2 gap-8 items-center relative z-10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight" style={{ fontFamily: "Tajawal" }}>
              اكتشف العالم مع سكاي سودان
            </h1>
            <p className="mt-3 text-sm sm:text-base" style={{ color: "#E7ECF6" }}>
              احجز رحلتك الآن عبر بدر للطيران وتاركو والخطوط الجوية السودانية من مكان واحد
            </p>
            <div className="mt-6 flex items-center gap-4">
              <button
                onClick={onSearch}
                className="flex items-center gap-2 font-extrabold px-6 py-3 rounded-xl text-white"
                style={{ background: C.blue, fontFamily: "Tajawal" }}
              >
                <Plane className="h-4 w-4" /> احجز رحلتك الآن
              </button>
            </div>
          </div>
          <div className="relative h-56 sm:h-72 flex items-center justify-center">
            <div
              className="absolute h-40 w-40 sm:h-52 sm:w-52 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(255,214,140,0.55) 0%, rgba(255,214,140,0) 70%)" }}
            />
            <Plane
              className="relative h-24 w-24 sm:h-28 sm:w-28 text-white drop-shadow-2xl"
              style={{ transform: "rotate(35deg)" }}
              strokeWidth={1.4}
            />
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 -mt-14 relative z-10">
          <SearchWidget state={search} setState={setSearch} onSearch={onSearch} />
        </div>
        <div className="h-14" />
      </section>

      <section className="bg-white border-b" style={{ borderColor: C.border }}>
        <div className="max-w-6xl mx-auto px-6 py-8 grid sm:grid-cols-4 gap-6 text-center">
          {[
            { icon: ShieldCheck, t: "حجز آمن وسريع", d: "نضمن لك أمان بياناتك" },
            { icon: Headphones, t: "دعم على مدار الساعة", d: "فريق الدعم متاح 24/7" },
            { icon: Tag, t: "أفضل الأسعار", d: "نضمن لك أفضل الأسعار" },
            { icon: Briefcase, t: "أمتعة مضمونة", d: "سياسة أمتعة مرنة" },
          ].map((f) => (
            <div key={f.t} className="flex flex-col items-center gap-2">
              <f.icon className="h-6 w-6" style={{ color: C.blue }} />
              <div className="font-bold text-sm" style={{ fontFamily: "Tajawal" }}>{f.t}</div>
              <div className="text-xs" style={{ color: C.sub }}>{f.d}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-xl font-black text-center" style={{ fontFamily: "Tajawal", color: C.navy }}>
          وجهات مميزة
        </h2>
        <p className="text-center text-sm mt-1" style={{ color: C.sub }}>
          اكتشف أجمل الوجهات حول العالم مع سكاي سودان
        </p>
        <div className="mt-7 grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {DESTINATIONS.map((d) => (
            <div key={d.city} className="rounded-xl overflow-hidden shadow-sm relative h-40" style={{ background: `linear-gradient(160deg, ${d.from}, ${d.to})` }}>
              <d.icon className="h-9 w-9 text-white/30 absolute left-3 bottom-10" />
              <div className="absolute top-3 right-3 text-white font-extrabold text-base" style={{ fontFamily: "Tajawal" }}>
                {d.city}
              </div>
              <div className="absolute bottom-3 left-3 bg-white rounded-lg px-2.5 py-1 text-xs">
                <span style={{ color: C.sub }}>ابتداءً من</span>{" "}
                <span className="font-extrabold" style={{ color: C.blue, fontFamily: "IBM Plex Mono" }}>
                  ${d.price}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: C.navy }} className="py-8">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center text-white">
          {[
            { n: "500+", l: "رحلة يوميًا" },
            { n: "50+", l: "وجهة حول العالم" },
            { n: "100K+", l: "مسافر سنويًا" },
            { n: "15+", l: "سنوات من الخبرة" },
          ].map((s) => (
            <div key={s.l}>
              <div className="text-2xl font-black" style={{ fontFamily: "IBM Plex Mono" }}>{s.n}</div>
              <div className="text-xs mt-1" style={{ color: "#9FB3D9" }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-white border-t" style={{ borderColor: C.border }}>
        <div className="max-w-6xl mx-auto px-6 py-8 grid sm:grid-cols-3 gap-6 items-center">
          <Logo />
          <div className="text-xs text-center" style={{ color: C.sub }}>
            منصة تجريبية لحجز الرحلات وإدارة المسافرين والحجوزات من مكان واحد.
          </div>
          <div className="text-xs sm:text-left text-center" style={{ color: C.sub, fontFamily: "IBM Plex Mono" }}>
            © 2026 Sky Sudan
          </div>
        </div>
      </footer>
    </div>
  );
}

/* =========================================================
   LOGIN / SIGNUP
========================================================= */
function LabeledInput({ label, icon: Icon, value, onChange, placeholder }) {
  return (
    <div>
      <label className="text-xs font-bold" style={{ color: C.navy }}>
        {label}
      </label>
      <div className="mt-1 flex items-center border rounded-lg px-3" style={{ borderColor: C.border }}>
        <Icon className="h-4 w-4" style={{ color: C.sub }} />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-2 py-2.5 outline-none text-sm"
        />
      </div>
    </div>
  );
}

function LoginView({ go, back, initialTab, onAuth }) {
  const [tab, setTab] = useState(initialTab || "login");
  const [showPw, setShowPw] = useState(false);
  const [asRole, setAsRole] = useState("passenger");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    setError("");
    if (!isSupabaseConfigured) {
      // وضع العرض التجريبي (بدون قاعدة بيانات مظبوطة بعد)
      onAuth(asRole, name || "أحمد محمد", "demo-" + asRole);
      return;
    }
    if (!email || !password) {
      setError("املأ البريد الإلكتروني وكلمة المرور");
      return;
    }
    setBusy(true);
    try {
      const authedUser = tab === "signup" ? await auth.signUp(name, email, password) : await auth.signIn(email, password);
      if (tab === "signup" && !authedUser) {
        setError("تم إرسال رابط تأكيد للبريد الإلكتروني — أكّد الحساب ثم سجّل الدخول");
        setBusy(false);
        return;
      }
      // نستنى شوية عشان الـ trigger في القاعدة يكمّل إنشاء البروفايل بعد أول signUp
      let profile;
      for (let i = 0; i < 3; i++) {
        try {
          profile = await auth.getProfile(authedUser.id);
          break;
        } catch (e) {
          await new Promise((r) => setTimeout(r, 500));
        }
      }
      const role = profile?.role === "مسؤول" ? "admin" : "passenger";
      onAuth(role, profile?.name || name || email, authedUser.id);
    } catch (e) {
      setError(e.message === "Invalid login credentials" ? "البريد أو كلمة المرور غلط" : e.message);
    }
    setBusy(false);
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2" dir="rtl">
      <div
        className="hidden lg:flex flex-col justify-between p-10 relative overflow-hidden"
        style={{ background: `linear-gradient(180deg, ${C.navy} 0%, #1B3B6E 55%, #B9762F 100%)` }}
      >
        <CloudLayer bottom={90} />
        <div
          className="absolute -bottom-16 -left-16 w-[130%] h-56"
          style={{
            background: "#0A1730",
            clipPath: "polygon(0% 100%, 8% 20%, 100% 55%, 100% 100%)",
            opacity: 0.9,
          }}
        />
        <Logo light />
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-white" style={{ fontFamily: "Tajawal" }}>
            مرحبًا بعودتك
          </h2>
          <p className="mt-2 text-sm max-w-sm" style={{ color: "#E7ECF6" }}>
            سجّل الدخول لإدارة حجوزاتك واكتشاف وجهات جديدة
          </p>
          <div className="mt-8 space-y-4">
            {[
              { icon: ShieldCheck, t: "حجز آمن", d: "نضمن لك حماية بياناتك وخصوصيتك" },
              { icon: BadgeCheck, t: "إدارة سهلة", d: "تابع حجوزاتك وغيّر خطط سفرك بسهولة" },
              { icon: Headphones, t: "دعم على مدار الساعة", d: "فريقنا جاهز لخدمتك 24/7" },
            ].map((f) => (
              <div key={f.t} className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.12)" }}>
                  <f.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-white font-bold text-sm" style={{ fontFamily: "Tajawal" }}>{f.t}</div>
                  <div className="text-xs" style={{ color: "#D8E1F2" }}>{f.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 rounded-xl p-4 grid grid-cols-4 gap-2 text-center" style={{ background: "rgba(10,20,40,0.45)" }}>
          {[["50+", "وجهة"], ["15+", "طيران"], ["100K+", "مسافر"], ["24/7", "دعم"]].map(([n, l]) => (
            <div key={l}>
              <div className="text-white font-black text-sm" style={{ fontFamily: "IBM Plex Mono" }}>{n}</div>
              <div className="text-[10px]" style={{ color: "#D8E1F2" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-10 bg-white">
        <div className="w-full max-w-sm">
          <div className="flex rounded-full p-1 mb-6" style={{ background: C.bg }}>
            <button
              onClick={() => setTab("signup")}
              className="flex-1 py-2 rounded-full text-sm font-bold"
              style={tab === "signup" ? { background: C.blue, color: "#fff" } : { color: C.sub }}
            >
              إنشاء حساب
            </button>
            <button
              onClick={() => setTab("login")}
              className="flex-1 py-2 rounded-full text-sm font-bold"
              style={tab === "login" ? { background: C.blue, color: "#fff" } : { color: C.sub }}
            >
              تسجيل الدخول
            </button>
          </div>

          <h3 className="text-xl font-black" style={{ fontFamily: "Tajawal", color: C.navy }}>
            {tab === "login" ? "تسجيل الدخول" : "إنشاء حساب جديد"}
          </h3>
          <p className="text-sm mt-1" style={{ color: C.sub }}>
            {tab === "login" ? "مرحبًا بك مجددًا في سكاي سودان" : "انشئ حسابك للاستفادة من مزايانا"}
          </p>

          <div className="mt-5 space-y-3">
            {tab === "signup" && (
              <LabeledInput label="الاسم الكامل" icon={User} value={name} onChange={setName} placeholder="اسمك الكامل" />
            )}
            <LabeledInput label="البريد الإلكتروني" icon={Mail} value={email} onChange={setEmail} placeholder="example@email.com" />
            <div>
              <label className="text-xs font-bold" style={{ color: C.navy }}>
                كلمة المرور
              </label>
              <div className="mt-1 flex items-center border rounded-lg px-3" style={{ borderColor: C.border }}>
                <Lock className="h-4 w-4" style={{ color: C.sub }} />
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="أدخل كلمة المرور"
                  className="flex-1 px-2 py-2.5 outline-none text-sm"
                />
                <button onClick={() => setShowPw((s) => !s)}>
                  {showPw ? <EyeOff className="h-4 w-4" style={{ color: C.sub }} /> : <Eye className="h-4 w-4" style={{ color: C.sub }} />}
                </button>
              </div>
            </div>

            {!isSupabaseConfigured && (
              <div>
                <label className="text-xs font-bold" style={{ color: C.navy }}>
                  الدخول كـ (عرض تجريبي بدون قاعدة بيانات)
                </label>
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => setAsRole("passenger")}
                    className="flex-1 text-xs font-bold py-2 rounded-lg border-2"
                    style={asRole === "passenger" ? { borderColor: C.blue, color: C.blue, background: "#EEF4FF" } : { borderColor: C.border, color: C.sub }}
                  >
                    مسافر
                  </button>
                  <button
                    onClick={() => setAsRole("admin")}
                    className="flex-1 text-xs font-bold py-2 rounded-lg border-2"
                    style={asRole === "admin" ? { borderColor: C.blue, color: C.blue, background: "#EEF4FF" } : { borderColor: C.border, color: C.sub }}
                  >
                    موظف (إدارة)
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="text-xs font-bold rounded-lg px-3 py-2" style={{ background: "#FEE2E2", color: C.danger }}>
                {error}
              </div>
            )}

            {tab === "login" && (
              <div className="flex items-center justify-between text-xs font-bold">
                <label className="flex items-center gap-1.5" style={{ color: C.sub }}>
                  <input type="checkbox" /> تذكرني
                </label>
                <a style={{ color: C.blue }}>نسيت كلمة المرور؟</a>
              </div>
            )}

            <button
              onClick={submit}
              disabled={busy}
              className="w-full font-extrabold py-3 rounded-xl text-white flex items-center justify-center gap-2"
              style={{ background: busy ? "#93B6F5" : C.blue, fontFamily: "Tajawal" }}
            >
              <Plane className="h-4 w-4" /> {busy ? "جارِ التنفيذ..." : tab === "login" ? "تسجيل الدخول" : "إنشاء حساب"}
            </button>

            <div className="flex items-center gap-3 py-1">
              <span className="flex-1 h-px" style={{ background: C.border }} />
              <span className="text-xs" style={{ color: C.sub }}>أو</span>
              <span className="flex-1 h-px" style={{ background: C.border }} />
            </div>
            <div className="grid grid-cols-3 gap-2">
              {["Google", "Apple", "Facebook"].map((p) => (
                <button key={p} className="border rounded-lg py-2 text-xs font-bold" style={{ borderColor: C.border, color: C.text }}>
                  {p}
                </button>
              ))}
            </div>
            <button onClick={() => (back ? back() : go("home"))} className="w-full text-center text-xs font-bold pt-2" style={{ color: C.sub }}>
              رجوع
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   Shared booking-flow chrome
========================================================= */
function FlowHeader({ go, back, title, user }) {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-white border-b" style={{ borderColor: C.border }}>
      <div className="flex items-center gap-3">
        {back && (
          <button
            onClick={back}
            className="h-9 w-9 rounded-full border flex items-center justify-center shrink-0"
            style={{ borderColor: C.border }}
            aria-label="رجوع"
          >
            <ArrowRight className="h-4 w-4" style={{ color: C.navy }} />
          </button>
        )}
        <button onClick={() => go("home")} className="flex items-center gap-2">
          <Logo />
        </button>
      </div>
      <div className="text-sm font-bold hidden sm:block" style={{ color: C.navy, fontFamily: "Tajawal" }}>{title}</div>
      {user ? (
        <button onClick={() => go("userDashboard")} className="flex items-center gap-2 text-sm font-bold" style={{ color: C.navy }}>
          <div className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: C.blue }}>
            {user.name.slice(0, 1)}
          </div>
          {user.name}
        </button>
      ) : (
        <span className="text-xs" style={{ color: C.sub }}>ضيف</span>
      )}
    </div>
  );
}

function Info({ label, value, accent }) {
  return (
    <div className="border rounded-xl px-3 py-2" style={{ borderColor: C.border }}>
      <div className="text-[11px] font-bold" style={{ color: C.sub }}>{label}</div>
      <div className="font-black" style={{ color: accent ? C.blue : C.navy, fontFamily: accent ? "IBM Plex Mono" : "Tajawal" }}>
        {value}
      </div>
    </div>
  );
}

/* =========================================================
   RESULTS
========================================================= */
function ResultsView({ go, back, search, results, onPick }) {
  return (
    <div style={{ background: C.bg }} className="min-h-screen">
      <FlowHeader go={go} back={back} title="نتائج البحث" />
      <div className="max-w-4xl mx-auto px-5 py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-black" style={{ fontFamily: "Tajawal", color: C.navy }}>
            {results.length} رحلة متاحة من {search.origin} إلى {search.destination}
          </h2>
          <span className="text-xs font-bold" style={{ color: C.sub }}>{search.depDate}</span>
        </div>

        {results.length === 0 && (
          <div className="bg-white rounded-2xl p-10 text-center" style={{ color: C.sub }}>
            لا توجد رحلات مطابقة — جرّب مدنًا أخرى
          </div>
        )}

        <div className="grid gap-3">
          {results.map((f) => {
            const a = airline(f.airline);
            return (
              <div key={f.id} className="bg-white rounded-2xl p-5 grid sm:grid-cols-[1fr_auto] gap-4 shadow-sm">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <AirlineBadge id={f.airline} />
                    <span className="text-xs font-bold" style={{ color: C.sub, fontFamily: "IBM Plex Mono" }}>{f.id}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="text-xl font-black" style={{ fontFamily: "IBM Plex Mono" }}>{f.dep}</div>
                      <div className="text-xs font-bold opacity-60">{CITY_CODE[f.from]}</div>
                    </div>
                    <div className="flex-1 flex flex-col items-center min-w-[80px]">
                      <span className="text-[11px] font-bold opacity-50">{f.dur}</span>
                      <div className="w-full h-px my-1" style={{ background: C.border }} />
                      <span className="text-[11px] font-bold opacity-50">مباشرة</span>
                    </div>
                    <div>
                      <div className="text-xl font-black" style={{ fontFamily: "IBM Plex Mono" }}>{f.arr}</div>
                      <div className="text-xs font-bold opacity-60">{CITY_CODE[f.to]}</div>
                    </div>
                  </div>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 sm:border-r sm:pr-4" style={{ borderColor: C.border }}>
                  <div className="text-2xl font-black" style={{ color: C.blue, fontFamily: "IBM Plex Mono" }}>
                    ${f.price}
                  </div>
                  <button
                    onClick={() => onPick(f)}
                    className="font-extrabold px-5 py-2.5 rounded-xl text-white"
                    style={{ background: C.navy, fontFamily: "Tajawal" }}
                  >
                    اختر
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   FLIGHT DETAILS
========================================================= */
function FlightDetailsView({ go, back, flight, onContinue, user }) {
  const a = airline(flight.airline);
  return (
    <div style={{ background: C.bg }} className="min-h-screen">
      <FlowHeader go={go} back={back} title="تفاصيل الرحلة" user={user} />
      <div className="max-w-2xl mx-auto px-5 py-8">
        <StepIndicator step={0} />
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <AirlineBadge id={flight.airline} />
            <span className="text-xs font-bold" style={{ color: C.sub, fontFamily: "IBM Plex Mono" }}>{flight.id}</span>
          </div>
          <div className="flex items-center justify-between mt-5">
            <div className="text-center">
              <div className="text-3xl font-black" style={{ fontFamily: "IBM Plex Mono" }}>{flight.dep}</div>
              <div className="text-sm font-bold mt-1">{flight.from}</div>
              <div className="text-xs opacity-50">{CITY_CODE[flight.from]}</div>
            </div>
            <div className="flex flex-col items-center flex-1 px-4">
              <Plane className="h-5 w-5 rotate-180" style={{ color: a.color }} />
              <div className="w-full h-px my-2" style={{ background: C.border }} />
              <div className="text-xs font-bold" style={{ color: C.sub }}>{flight.dur} · مباشرة</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black" style={{ fontFamily: "IBM Plex Mono" }}>{flight.arr}</div>
              <div className="text-sm font-bold mt-1">{flight.to}</div>
              <div className="text-xs opacity-50">{CITY_CODE[flight.to]}</div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mt-6 text-sm">
            <Info label="الطائرة" value={flight.aircraft} />
            <Info label="الدرجة" value="الدرجة الاقتصادية" />
            <Info label="الأمتعة المسموح بها" value="حقيبة مسجلة 23 كجم" />
            <Info label="السعر الإجمالي" value={`$${flight.price}`} accent />
          </div>

          <button
            onClick={onContinue}
            className="w-full mt-6 font-extrabold py-3 rounded-xl text-white"
            style={{ background: C.blue, fontFamily: "Tajawal" }}
          >
            متابعة لاختيار المقاعد
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   SEATS
========================================================= */
function SeatsView({ go, back, flight, pax, seats, setSeats, onContinue, user }) {
  function toggle(code) {
    if (seatTaken(flight.id, code)) return;
    setSeats((prev) => {
      if (prev.includes(code)) return prev.filter((s) => s !== code);
      if (prev.length >= pax) return prev;
      return [...prev, code];
    });
  }
  return (
    <div style={{ background: C.bg }} className="min-h-screen">
      <FlowHeader go={go} back={back} title="اختيار المقاعد" user={user} />
      <div className="max-w-lg mx-auto px-5 py-8">
        <StepIndicator step={1} />
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-center gap-4 text-[11px] font-bold mb-4" style={{ color: C.sub }}>
            <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-sm inline-block border" style={{ borderColor: C.border }} /> متاح</span>
            <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-sm inline-block" style={{ background: C.blue }} /> مُختار</span>
            <span className="flex items-center gap-1"><span className="h-3 w-3 rounded-sm inline-block" style={{ background: "#D1D5DB" }} /> محجوز</span>
          </div>
          <div className="mx-auto rounded-t-3xl border-2 pt-4 pb-2 px-3" style={{ borderColor: C.border, maxWidth: 280 }}>
            {Array.from({ length: ROWS }).map((_, r) => {
              const row = r + 1;
              return (
                <div key={row} className="flex items-center gap-1.5 justify-center mb-1.5">
                  <span className="text-[10px] w-4 font-bold opacity-40" style={{ fontFamily: "IBM Plex Mono" }}>{row}</span>
                  {COLS.map((col, ci) => {
                    const code = `${row}${col}`;
                    const taken = seatTaken(flight.id, code);
                    const selected = seats.includes(code);
                    return (
                      <React.Fragment key={code}>
                        {ci === 3 && <span className="w-3" />}
                        <button
                          disabled={taken}
                          onClick={() => toggle(code)}
                          className="h-6 w-6 rounded-sm text-[9px] font-bold flex items-center justify-center"
                          style={{
                            background: taken ? "#D1D5DB" : selected ? C.blue : "#fff",
                            border: taken ? "none" : `1px solid ${C.border}`,
                            color: selected ? "#fff" : C.text,
                            cursor: taken ? "not-allowed" : "pointer",
                            fontFamily: "IBM Plex Mono",
                          }}
                        >
                          {col}
                        </button>
                      </React.Fragment>
                    );
                  })}
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between mt-4 text-sm font-bold">
            <span>{seats.length} / {pax} مقاعد مختارة</span>
            <span style={{ color: C.blue, fontFamily: "IBM Plex Mono" }}>${flight.price * seats.length}</span>
          </div>
          <button
            disabled={seats.length !== pax}
            onClick={onContinue}
            className="w-full mt-4 font-extrabold py-3 rounded-xl text-white"
            style={{ background: seats.length === pax ? C.blue : "#D1D5DB", fontFamily: "Tajawal" }}
          >
            تأكيد المقاعد
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   PASSENGER INFO
========================================================= */
function TextField({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="text-xs font-bold" style={{ color: C.navy }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border rounded-lg px-3 py-2 text-sm outline-none"
        style={{ borderColor: C.border, fontFamily: type === "date" ? "IBM Plex Mono" : "Tajawal" }}
      />
    </div>
  );
}

function PassengerInfoView({ go, back, pax, forms, setForms, onContinue, user }) {
  function update(i, field, value) {
    setForms((prev) => prev.map((f, idx) => (idx === i ? { ...f, [field]: value } : f)));
  }
  return (
    <div style={{ background: C.bg }} className="min-h-screen">
      <FlowHeader go={go} back={back} title="بيانات المسافر" user={user} />
      <div className="max-w-2xl mx-auto px-5 py-8">
        <StepIndicator step={2} />
        <div className="space-y-4">
          {forms.map((f, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="font-black mb-3" style={{ fontFamily: "Tajawal", color: C.navy }}>
                المسافر {i + 1}
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <TextField label="الاسم الأول" value={f.first} onChange={(v) => update(i, "first", v)} />
                <TextField label="الاسم الأخير" value={f.last} onChange={(v) => update(i, "last", v)} />
                <TextField label="تاريخ الميلاد" type="date" value={f.dob} onChange={(v) => update(i, "dob", v)} />
                <TextField label="الجنسية" value={f.nationality} onChange={(v) => update(i, "nationality", v)} />
                <TextField label="رقم الجواز" value={f.passport} onChange={(v) => update(i, "passport", v)} />
                <TextField label="تاريخ انتهاء الجواز" type="date" value={f.passportExp} onChange={(v) => update(i, "passportExp", v)} />
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={onContinue}
          className="w-full mt-5 font-extrabold py-3 rounded-xl text-white"
          style={{ background: C.blue, fontFamily: "Tajawal" }}
        >
          المتابعة للدفع
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   PAYMENT
========================================================= */
function PaymentView({ go, back, total, onPay, user }) {
  const [method, setMethod] = useState("card");
  return (
    <div style={{ background: C.bg }} className="min-h-screen">
      <FlowHeader go={go} back={back} title="الدفع" user={user} />
      <div className="max-w-lg mx-auto px-5 py-8">
        <StepIndicator step={3} />
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="font-bold" style={{ color: C.sub }}>المبلغ الإجمالي</span>
            <span className="text-2xl font-black" style={{ color: C.blue, fontFamily: "IBM Plex Mono" }}>${total}</span>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { id: "card", label: "بطاقة ائتمان", icon: CreditCard },
              { id: "fawry", label: "فوري", icon: Wallet },
              { id: "paypal", label: "PayPal", icon: Wallet },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setMethod(m.id)}
                className="flex flex-col items-center gap-1 py-3 rounded-xl border-2 text-xs font-bold"
                style={method === m.id ? { borderColor: C.blue, color: C.blue, background: "#EEF4FF" } : { borderColor: C.border, color: C.sub }}
              >
                <m.icon className="h-4 w-4" /> {m.label}
              </button>
            ))}
          </div>

          {method === "card" && (
            <div className="space-y-3">
              <TextField label="رقم البطاقة" value="4242 4242 4242 4242" onChange={() => {}} />
              <div className="grid grid-cols-2 gap-3">
                <TextField label="تاريخ الانتهاء" value="06/28" onChange={() => {}} />
                <TextField label="CVV" value="123" onChange={() => {}} />
              </div>
            </div>
          )}
          {method !== "card" && (
            <div className="text-sm rounded-xl p-4 text-center" style={{ background: C.bg, color: C.sub }}>
              سيتم تحويلك لإتمام الدفع عبر {method === "fawry" ? "فوري" : "PayPal"}
            </div>
          )}

          <button
            onClick={onPay}
            className="w-full mt-5 font-extrabold py-3 rounded-xl text-white"
            style={{ background: C.blue, fontFamily: "Tajawal" }}
          >
            ادفع الآن
          </button>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   E-TICKET
========================================================= */
function ETicketView({ go, booking, user, toast }) {
  const { flight, seats, forms, pnr } = booking;
  const a = airline(flight.airline);
  return (
    <div style={{ background: C.bg }} className="min-h-screen">
      <FlowHeader go={go} title="التذكرة الإلكترونية" user={user} />
      <div className="max-w-md mx-auto px-5 py-8">
        <StepIndicator step={4} />
        <div className="rounded-2xl overflow-hidden shadow-lg">
          <div className="p-6 text-center" style={{ background: C.success }}>
            <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-2">
              <Check className="h-6 w-6 text-white" strokeWidth={3} />
            </div>
            <div className="text-white font-black" style={{ fontFamily: "Tajawal" }}>تم حجز رحلتك بنجاح!</div>
          </div>
          <div className="bg-white p-6">
            <div className="flex items-center gap-2 mb-2">
              <AirlineBadge id={flight.airline} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-black" style={{ fontFamily: "IBM Plex Mono" }}>{CITY_CODE[flight.from]}</span>
              <Plane className="h-4 w-4 rotate-180 opacity-40" style={{ color: a.color }} />
              <span className="text-lg font-black" style={{ fontFamily: "IBM Plex Mono" }}>{CITY_CODE[flight.to]}</span>
            </div>
            <div className="text-xs text-center mt-1" style={{ color: C.sub }}>رقم الحجز</div>
            <div className="text-center font-black text-sm mb-4" style={{ fontFamily: "IBM Plex Mono", color: C.blue }}>{pnr}</div>

            <div className="flex justify-center mb-4">
              <QRPattern seed={pnr} />
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <Info label="التاريخ" value={flight.dep + " – " + flight.arr} />
              <Info label="رقم الرحلة" value={flight.id} />
              <Info label="الطائرة" value={flight.aircraft} />
              <Info label="المقاعد" value={seats.join(" · ")} />
              <Info label="المسافر" value={forms[0]?.first + " " + forms[0]?.last} />
              <Info label="الإجمالي" value={`$${flight.price * seats.length}`} accent />
            </div>

            <div className="grid grid-cols-2 gap-2 mt-5">
              <button
                onClick={() => toast("تم تحميل التذكرة (تجريبي)")}
                className="flex items-center justify-center gap-1.5 border-2 rounded-xl py-2.5 text-sm font-bold"
                style={{ borderColor: C.blue, color: C.blue }}
              >
                <Download className="h-4 w-4" /> تحميل PDF
              </button>
              <button
                onClick={() => toast("تم إرسال التذكرة بالبريد")}
                className="flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-sm font-bold text-white"
                style={{ background: C.blue }}
              >
                <Send className="h-4 w-4" /> إرسال بالبريد
              </button>
            </div>
            <button
              onClick={() => go("userDashboard")}
              className="w-full mt-3 font-bold py-2.5 rounded-xl"
              style={{ background: C.bg, color: C.navy }}
            >
              الانتقال إلى لوحة المستخدم
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   USER DASHBOARD
========================================================= */
function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-3">
      <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: "#EEF4FF" }}>
        <Icon className="h-5 w-5" style={{ color: C.blue }} />
      </div>
      <div>
        <div className="text-xl font-black" style={{ fontFamily: "IBM Plex Mono", color: C.navy }}>{value}</div>
        <div className="text-xs" style={{ color: C.sub }}>{label}</div>
      </div>
    </div>
  );
}

function UserDashboardView({ go, back, user, myBooking, onLogout }) {
  const [bookings, setBookings] = useState(
    myBooking
      ? [{ pnr: myBooking.pnr, route: `${CITY_CODE[myBooking.flight.from]} → ${CITY_CODE[myBooking.flight.to]}`, date: myBooking.flight.dep, status: "مؤكد" }]
      : []
  );
  const [newFlights, setNewFlights] = useState([]);
  const [loadingFlights, setLoadingFlights] = useState(true);

  React.useEffect(() => {
    (async () => {
      // رحلات جديدة من كل الشركات — بتتحمّل أول ما المستخدم يدخل لوحته
      const all = await api.listFlights();
      setNewFlights(all.slice(0, 6));
      setLoadingFlights(false);

      if (isSupabaseConfigured && user?.id) {
        const mine = await api.listMyBookings(user.id);
        if (mine) setBookings(mine);
      } else if (!myBooking) {
        setBookings(ADMIN_BOOKINGS.slice(0, 2).map((b) => ({ pnr: b.pnr, route: b.route, date: b.date, status: b.status })));
      }
    })();
  }, [user?.id]);

  const total = myBooking ? myBooking.flight.price * myBooking.seats.length : bookings.reduce((s, b) => s + (b.total || 0), 0);

  return (
    <div style={{ background: C.bg }} className="min-h-screen">
      <FlowHeader go={go} back={back} title="لوحة المستخدم" user={user} />
      <div className="max-w-3xl mx-auto px-5 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-black text-lg" style={{ fontFamily: "Tajawal", color: C.navy }}>
              مرحبًا بيك، {user?.name || "أحمد"}
            </h2>
            <p className="text-xs" style={{ color: C.sub }}>إدارة حجوزاتك ومتابعة رحلاتك القادمة</p>
          </div>
          <button onClick={onLogout} className="flex items-center gap-1.5 text-sm font-bold" style={{ color: C.danger }}>
            <LogOut className="h-4 w-4" /> تسجيل الخروج
          </button>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <StatCard label="رحلاتي" value={bookings.length} icon={PlaneTakeoff} />
          <StatCard label="الحجوزات النشطة" value={bookings.filter((b) => b.status === "مؤكد").length} icon={Ticket} />
          <StatCard label="إجمالي المدفوع" value={`$${total || 450}`} icon={CreditCard} />
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
          <div className="px-5 py-4 border-b font-black" style={{ borderColor: C.border, fontFamily: "Tajawal", color: C.navy }}>
            حجوزاتي
          </div>
          {bookings.length === 0 && (
            <div className="px-5 py-8 text-center text-sm" style={{ color: C.sub }}>لسه معندكش حجوزات</div>
          )}
          {bookings.map((b, i) => (
            <div key={i} className="flex items-center justify-between px-5 py-4 border-b last:border-0" style={{ borderColor: C.border }}>
              <div>
                <div className="font-bold text-sm" style={{ fontFamily: "IBM Plex Mono" }}>{b.route}</div>
                <div className="text-xs" style={{ color: C.sub }}>رقم الحجز {b.pnr} · {b.date}</div>
              </div>
              <div className="flex items-center gap-3">
                <StatusPill status={b.status} />
                <button className="text-xs font-bold" style={{ color: C.blue }}>عرض التذكرة</button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b font-black" style={{ borderColor: C.border, fontFamily: "Tajawal", color: C.navy }}>
            رحلات جديدة من كل الشركات
          </div>
          {loadingFlights ? (
            <div className="px-5 py-8 text-center text-sm" style={{ color: C.sub }}>جارِ التحميل...</div>
          ) : (
            newFlights.map((f) => (
              <div key={f.id} className="flex items-center justify-between px-5 py-3 border-b last:border-0" style={{ borderColor: C.border }}>
                <div className="flex items-center gap-2">
                  <AirlineBadge id={f.airline} />
                  <span className="text-sm font-bold" style={{ fontFamily: "IBM Plex Mono" }}>
                    {CITY_CODE[f.from] || f.from} → {CITY_CODE[f.to] || f.to}
                  </span>
                </div>
                <span className="text-sm font-black" style={{ color: C.blue, fontFamily: "IBM Plex Mono" }}>${f.price}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   ADMIN
========================================================= */
function AdminSidebar({ tab, setTab, go, onLogout }) {
  const items = [
    { id: "overview", label: "الرئيسية", icon: LayoutDashboard },
    { id: "flights", label: "الرحلات", icon: PlaneTakeoff },
    { id: "bookings", label: "الحجوزات", icon: Ticket },
    { id: "users", label: "المستخدمين", icon: Users2 },
    { id: "passengers", label: "المسافرين", icon: User },
    { id: "reports", label: "التقارير", icon: FileText },
    { id: "settings", label: "الإعدادات", icon: Settings },
  ];
  return (
    <div className="w-56 shrink-0 min-h-screen p-4 hidden md:block" style={{ background: C.navy }}>
      <div className="mb-8 px-2">
        <Logo light />
      </div>
      <div className="space-y-1">
        {items.map((it) => (
          <button
            key={it.id}
            onClick={() => setTab(it.id)}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold"
            style={{
              background: tab === it.id ? "rgba(29,111,239,0.25)" : "transparent",
              color: tab === it.id ? "#fff" : "#9FB3D9",
              fontFamily: "Tajawal",
            }}
          >
            <it.icon className="h-4 w-4" /> {it.label}
          </button>
        ))}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-bold mt-4"
          style={{ color: "#F1A9A9", fontFamily: "Tajawal" }}
        >
          <LogOut className="h-4 w-4" /> تسجيل الخروج
        </button>
      </div>
    </div>
  );
}

function AdminOverview() {
  return (
    <div>
      <div className="grid sm:grid-cols-4 gap-4 mb-6">
        <StatCard label="إجمالي الرحلات" value="128" icon={PlaneTakeoff} />
        <StatCard label="إجمالي الحجوزات" value="1,254" icon={Ticket} />
        <StatCard label="إجمالي المسافرين" value="3,842" icon={Users2} />
        <StatCard label="إجمالي الإيرادات" value="$245,620" icon={CreditCard} />
      </div>
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <div className="font-black mb-3" style={{ fontFamily: "Tajawal", color: C.navy }}>
          الحجوزات خلال آخر 7 أيام
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={WEEKLY_BOOKINGS}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
            <XAxis dataKey="day" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke={C.blue} strokeWidth={3} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function TableHead({ cols }) {
  return (
    <thead>
      <tr className="border-b" style={{ borderColor: C.border }}>
        {cols.map((c) => (
          <th key={c} className="text-right px-5 py-3 text-xs font-bold" style={{ color: C.sub }}>
            {c}
          </th>
        ))}
      </tr>
    </thead>
  );
}
function Td({ children, mono, small }) {
  return (
    <td className="px-5 py-3 font-bold" style={{ fontFamily: mono ? "IBM Plex Mono" : "Tajawal", fontSize: small ? 12 : 14 }}>
      {children}
    </td>
  );
}
function RowActions({ viewOnly, hideEdit, onEdit, onDelete }) {
  return (
    <div className="flex items-center gap-2">
      {!hideEdit && (
        <button onClick={onEdit} className="h-7 w-7 rounded-lg flex items-center justify-center" style={{ background: C.bg }}>
          <Pencil className="h-3.5 w-3.5" style={{ color: C.blue }} />
        </button>
      )}
      {!viewOnly && (
        <button onClick={onDelete} className="h-7 w-7 rounded-lg flex items-center justify-center" style={{ background: C.bg }}>
          <Trash2 className="h-3.5 w-3.5" style={{ color: C.danger }} />
        </button>
      )}
    </div>
  );
}
function AdminTablePanel({ title, actionLabel, onAction, loading, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: C.border }}>
        <div className="font-black" style={{ fontFamily: "Tajawal", color: C.navy }}>{title}</div>
        {actionLabel && (
          <button
            onClick={onAction}
            className="flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-xl text-white"
            style={{ background: C.blue }}
          >
            <Plus className="h-4 w-4" /> {actionLabel}
          </button>
        )}
      </div>
      {loading ? (
        <div className="px-5 py-10 text-center text-sm font-bold" style={{ color: C.sub }}>
          جارِ التحميل...
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">{children}</table>
        </div>
      )}
    </div>
  );
}

const EMPTY_FLIGHT = { id: "", airline: "badr", from: "الخرطوم", to: "جدة", dep: "08:00", arr: "10:00", dur: "2س 00د", price: 100, aircraft: "Airbus A320", status: "نشطة" };

function AdminFlights({ toast }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // { mode: 'add'|'edit', values }

  async function load() {
    setLoading(true);
    setRows(await api.listFlights());
    setLoading(false);
  }
  React.useEffect(() => {
    load();
  }, []);

  async function save() {
    if (modal.mode === "add") await api.createFlight(modal.values);
    else await api.updateFlight(modal.values.id, modal.values);
    setModal(null);
    toast(modal.mode === "add" ? "تمت إضافة الرحلة" : "تم تحديث الرحلة");
    load();
  }
  async function remove(id) {
    if (!window.confirm("متأكد من حذف هذه الرحلة؟")) return;
    await api.deleteFlight(id);
    toast("تم حذف الرحلة");
    load();
  }

  return (
    <>
      <AdminTablePanel title="إدارة الرحلات" actionLabel="إضافة رحلة جديدة" onAction={() => setModal({ mode: "add", values: { ...EMPTY_FLIGHT } })} loading={loading}>
        <TableHead cols={["الرقم", "من", "إلى", "المغادرة", "الوصول", "الحالة", "إجراءات"]} />
        <tbody>
          {rows.map((f) => (
            <tr key={f.id} className="border-b last:border-0" style={{ borderColor: C.border }}>
              <Td mono>{f.id}</Td>
              <Td>{CITY_CODE[f.from] || f.from}</Td>
              <Td>{CITY_CODE[f.to] || f.to}</Td>
              <Td mono>{f.dep}</Td>
              <Td mono>{f.arr}</Td>
              <td className="py-3"><StatusPill status={f.status} /></td>
              <Td>
                <RowActions onEdit={() => setModal({ mode: "edit", values: { ...f } })} onDelete={() => remove(f.id)} />
              </Td>
            </tr>
          ))}
        </tbody>
      </AdminTablePanel>

      {modal && (
        <Modal title={modal.mode === "add" ? "إضافة رحلة جديدة" : "تعديل الرحلة"} onClose={() => setModal(null)}>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <SelectField label="من" value={modal.values.from} onChange={(v) => setModal((m) => ({ ...m, values: { ...m.values, from: v } }))} options={CITIES.map((c) => ({ value: c, label: c }))} />
              <SelectField label="إلى" value={modal.values.to} onChange={(v) => setModal((m) => ({ ...m, values: { ...m.values, to: v } }))} options={CITIES.map((c) => ({ value: c, label: c }))} />
            </div>
            <SelectField
              label="شركة التشغيل"
              value={modal.values.airline}
              onChange={(v) => setModal((m) => ({ ...m, values: { ...m.values, airline: v } }))}
              options={Object.keys(AIRLINES).map((k) => ({ value: k, label: AIRLINES[k].name }))}
            />
            <div className="grid grid-cols-2 gap-3">
              <TextField label="وقت المغادرة" value={modal.values.dep} onChange={(v) => setModal((m) => ({ ...m, values: { ...m.values, dep: v } }))} />
              <TextField label="وقت الوصول" value={modal.values.arr} onChange={(v) => setModal((m) => ({ ...m, values: { ...m.values, arr: v } }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <TextField label="السعر ($)" value={modal.values.price} onChange={(v) => setModal((m) => ({ ...m, values: { ...m.values, price: Number(v) || 0 } }))} />
              <TextField label="الطائرة" value={modal.values.aircraft} onChange={(v) => setModal((m) => ({ ...m, values: { ...m.values, aircraft: v } }))} />
            </div>
            <SelectField
              label="الحالة"
              value={modal.values.status}
              onChange={(v) => setModal((m) => ({ ...m, values: { ...m.values, status: v } }))}
              options={["نشطة", "مكتملة", "ملغاة"].map((s) => ({ value: s, label: s }))}
            />
            <button onClick={save} className="w-full font-extrabold py-3 rounded-xl text-white" style={{ background: C.blue, fontFamily: "Tajawal" }}>
              حفظ
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}

function AdminBookingsPanel({ toast }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  async function load() {
    setLoading(true);
    setRows(await api.listBookings());
    setLoading(false);
  }
  React.useEffect(() => {
    load();
  }, []);

  async function save() {
    await api.updateBooking(modal.values.pnr, { status: modal.values.status });
    setModal(null);
    toast("تم تحديث حالة الحجز");
    load();
  }
  async function remove(pnr) {
    if (!window.confirm("متأكد من حذف هذا الحجز؟")) return;
    await api.deleteBooking(pnr);
    toast("تم حذف الحجز");
    load();
  }

  return (
    <>
      <AdminTablePanel title="إدارة الحجوزات" loading={loading}>
        <TableHead cols={["رقم الحجز", "المسافر", "الرحلة", "التاريخ", "الحالة", "إجراءات"]} />
        <tbody>
          {rows.map((b) => (
            <tr key={b.pnr} className="border-b last:border-0" style={{ borderColor: C.border }}>
              <Td mono>{b.pnr}</Td>
              <Td>{b.passenger}</Td>
              <Td mono>{b.route}</Td>
              <Td mono>{b.date}</Td>
              <td className="py-3"><StatusPill status={b.status} /></td>
              <Td>
                <RowActions onEdit={() => setModal({ values: { ...b } })} onDelete={() => remove(b.pnr)} />
              </Td>
            </tr>
          ))}
        </tbody>
      </AdminTablePanel>

      {modal && (
        <Modal title={`تعديل حالة الحجز ${modal.values.pnr}`} onClose={() => setModal(null)}>
          <div className="space-y-3">
            <SelectField
              label="الحالة"
              value={modal.values.status}
              onChange={(v) => setModal((m) => ({ ...m, values: { ...m.values, status: v } }))}
              options={["مؤكد", "معلق", "ملغاة"].map((s) => ({ value: s, label: s }))}
            />
            <button onClick={save} className="w-full font-extrabold py-3 rounded-xl text-white" style={{ background: C.blue, fontFamily: "Tajawal" }}>
              حفظ
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}

function AdminUsersPanel({ toast }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  async function load() {
    setLoading(true);
    setRows(await api.listUsers());
    setLoading(false);
  }
  React.useEffect(() => {
    load();
  }, []);

  async function save() {
    await api.updateUser(modal.values.id, { role: modal.values.role, status: modal.values.status });
    setModal(null);
    toast("تم تحديث المستخدم");
    load();
  }
  async function remove(id) {
    if (!window.confirm("متأكد من حذف بروفايل هذا المستخدم؟ (حسابه في نظام الدخول هيفضل موجود)")) return;
    await api.deleteUser(id);
    toast("تم حذف البروفايل");
    load();
  }

  return (
    <>
      <AdminTablePanel title="إدارة المستخدمين" loading={loading}>
        <TableHead cols={["الاسم", "البريد", "الدور", "الحالة", "إجراءات"]} />
        <tbody>
          {rows.map((u) => (
            <tr key={u.id} className="border-b last:border-0" style={{ borderColor: C.border }}>
              <Td>{u.name}</Td>
              <Td mono small>{u.email}</Td>
              <Td>{u.role}</Td>
              <td className="py-3"><StatusPill status={u.status} /></td>
              <Td>
                <RowActions onEdit={() => setModal({ values: { ...u } })} onDelete={() => remove(u.id)} />
              </Td>
            </tr>
          ))}
        </tbody>
      </AdminTablePanel>
      {!isSupabaseConfigured && (
        <p className="text-xs mt-2" style={{ color: C.sub }}>
          الحسابات دلوقتي بتنشأ من صفحة "إنشاء حساب" فقط. هنا تقدر تعدّل الدور/الحالة أو تحذف بروفايل.
        </p>
      )}

      {modal && (
        <Modal title="تعديل المستخدم" onClose={() => setModal(null)}>
          <div className="space-y-3">
            <TextField label="الاسم" value={modal.values.name} onChange={() => {}} />
            <TextField label="البريد الإلكتروني" value={modal.values.email} onChange={() => {}} />
            <SelectField
              label="الدور"
              value={modal.values.role}
              onChange={(v) => setModal((m) => ({ ...m, values: { ...m.values, role: v } }))}
              options={["مستخدم", "مسؤول"].map((s) => ({ value: s, label: s }))}
            />
            <SelectField
              label="الحالة"
              value={modal.values.status}
              onChange={(v) => setModal((m) => ({ ...m, values: { ...m.values, status: v } }))}
              options={["نشط", "موقوف"].map((s) => ({ value: s, label: s }))}
            />
            <button onClick={save} className="w-full font-extrabold py-3 rounded-xl text-white" style={{ background: C.blue, fontFamily: "Tajawal" }}>
              حفظ
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}

function AdminPassengersPanel({ toast }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setRows(await api.listPassengers());
    setLoading(false);
  }
  React.useEffect(() => {
    load();
  }, []);

  async function remove(id) {
    if (!window.confirm("متأكد من حذف بيانات هذا المسافر؟")) return;
    await api.deletePassenger(id);
    toast("تم حذف المسافر");
    load();
  }

  return (
    <>
      <AdminTablePanel title="إدارة المسافرين" loading={loading}>
        <TableHead cols={["الاسم", "الجنسية", "رقم الجواز", "تاريخ الميلاد", "إجراءات"]} />
        <tbody>
          {rows.map((p) => (
            <tr key={p.id} className="border-b last:border-0" style={{ borderColor: C.border }}>
              <Td>{p.name}</Td>
              <Td>{p.nationality}</Td>
              <Td mono>{p.passport}</Td>
              <Td mono>{p.dob}</Td>
              <Td>
                <RowActions hideEdit onDelete={() => remove(p.id)} />
              </Td>
            </tr>
          ))}
        </tbody>
      </AdminTablePanel>
      <p className="text-xs mt-2" style={{ color: C.sub }}>
        بيانات المسافرين بتتسجل تلقائيًا وقت إتمام الحجز — القائمة دي للعرض والحذف فقط.
      </p>
    </>
  );
}

function AdminReports() {
  return (
    <div className="grid sm:grid-cols-2 gap-5">
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <div className="font-black mb-3" style={{ fontFamily: "Tajawal", color: C.navy }}>نسبة الحجوزات حسب الوجهة</div>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={DEST_SHARE} dataKey="value" nameKey="name" innerRadius={45} outerRadius={80}>
              {DEST_SHARE.map((d, i) => (
                <Cell key={i} fill={d.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap gap-3 justify-center mt-2">
          {DEST_SHARE.map((d) => (
            <span key={d.name} className="text-xs font-bold flex items-center gap-1">
              <span className="h-2 w-2 rounded-full" style={{ background: d.color }} /> {d.name} {d.value}%
            </span>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <div className="font-black mb-3" style={{ fontFamily: "Tajawal", color: C.navy }}>الإيرادات الشهرية</div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={MONTHLY_REVENUE}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="value" fill={C.blue} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function AdminSettings() {
  return (
    <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
      <Settings className="h-8 w-8 mx-auto mb-3" style={{ color: C.sub }} />
      <div className="font-black mb-1" style={{ fontFamily: "Tajawal", color: C.navy }}>الإعدادات قيد الإعداد</div>
      <p className="text-sm" style={{ color: C.sub }}>هذا القسم غير متاح بعد في هذه النسخة التجريبية</p>
    </div>
  );
}

function AdminView({ go, toast, onLogout }) {
  const [tab, setTab] = useState("overview");
  const titles = {
    overview: "لوحة الإدارة الرئيسية",
    flights: "إدارة الرحلات",
    bookings: "إدارة الحجوزات",
    users: "إدارة المستخدمين",
    passengers: "إدارة المسافرين",
    reports: "التقارير والإحصائيات",
    settings: "الإعدادات",
  };
  return (
    <div className="flex" style={{ background: C.bg }}>
      <AdminSidebar tab={tab} setTab={setTab} go={go} onLogout={onLogout} />
      <div className="flex-1 min-h-screen">
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b" style={{ borderColor: C.border }}>
          <div className="font-black" style={{ fontFamily: "Tajawal", color: C.navy }}>{titles[tab]}</div>
          <div className="flex items-center gap-2 text-sm font-bold" style={{ color: C.navy }}>
            <div className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: C.blue }}>A</div>
            Admin
          </div>
        </div>
        <div className="p-6">
          {tab === "overview" && <AdminOverview />}
          {tab === "flights" && <AdminFlights toast={toast} />}
          {tab === "bookings" && <AdminBookingsPanel toast={toast} />}
          {tab === "users" && <AdminUsersPanel toast={toast} />}
          {tab === "passengers" && <AdminPassengersPanel toast={toast} />}
          {tab === "reports" && <AdminReports />}
          {tab === "settings" && <AdminSettings />}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   ROOT APP
========================================================= */
export default function App() {
  const [view, setView] = useState("home");
  const [loginTab, setLoginTab] = useState("login");
  const [user, setUser] = useState(null);
  const [toastMsg, setToastMsg] = useState("");

  const [search, setSearch] = useState({
    tripType: "roundtrip",
    origin: "الخرطوم",
    destination: "جدة",
    depDate: "2026-08-15",
    retDate: "2026-08-22",
    pax: 1,
  });
  const [results, setResults] = useState([]);
  const [flight, setFlight] = useState(null);
  const [seats, setSeats] = useState([]);
  const [forms, setForms] = useState([]);
  const [booking, setBooking] = useState(null);

  const [navStack, setNavStack] = useState([]);

  function go(v, tab) {
    if (v === "login" && tab) setLoginTab(tab);
    setNavStack((prev) => [...prev, view]);
    setView(v);
    window.scrollTo?.(0, 0);
  }

  function goBack() {
    setNavStack((prev) => {
      if (prev.length === 0) {
        setView("home");
        return prev;
      }
      const stack = [...prev];
      const last = stack.pop();
      setView(last);
      return stack;
    });
    window.scrollTo?.(0, 0);
  }

  function showToast(msg) {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2200);
  }

  async function runSearch() {
    const found = await api.searchFlights(search.origin, search.destination);
    setResults(found);
    go("results");
  }

  function pickFlight(f) {
    setFlight(f);
    go("flightDetails");
  }

  function toSeats() {
    setSeats([]);
    go("seats");
  }

  function toPassengerInfo() {
    setForms(
      Array.from({ length: search.pax }).map(() => ({
        first: "",
        last: "",
        dob: "",
        nationality: "السودانية",
        passport: "",
        passportExp: "",
      }))
    );
    go("passengerInfo");
  }

  function toPayment() {
    go("payment");
  }

  React.useEffect(() => {
    if (!isSupabaseConfigured) return;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) return;
      try {
        const profile = await auth.getProfile(data.session.user.id);
        setUser({ id: profile.id, name: profile.name || profile.email, role: profile.role === "مسؤول" ? "admin" : "passenger" });
      } catch (e) {
        /* لسه مفيش بروفايل — تجاهل */
      }
    });
  }, []);

  async function completeBooking() {
    if (isSupabaseConfigured && !user) {
      showToast("سجّل دخولك الأول عشان يتم حفظ حجزك");
      go("login");
      return;
    }
    const pnr = makePNR(flight.id + seats.join(""));
    const total = flight.price * seats.length;
    try {
      await api.createBooking({ flight, seats, forms, pnr, userId: user?.id, total });
    } catch (e) {
      showToast("حصل خطأ أثناء حفظ الحجز");
      return;
    }
    setBooking({ flight, seats, forms, pnr });
    go("eticket");
  }

  function handleAuth(role, name, id) {
    setUser({ name, role, id });
    go(role === "admin" ? "admin" : "userDashboard");
  }

  async function doLogout() {
    await auth.signOut();
    setUser(null);
    go("home");
  }

  return (
    <div dir="rtl" lang="ar" style={{ fontFamily: "Tajawal", color: C.text }}>
      <style>{FONT_IMPORT}</style>

      {view === "home" && <HomeView go={go} search={search} setSearch={setSearch} onSearch={runSearch} />}
      {view === "login" && <LoginView go={go} back={goBack} initialTab={loginTab} onAuth={handleAuth} />}
      {view === "results" && <ResultsView go={go} back={goBack} search={search} results={results} onPick={pickFlight} />}
      {view === "flightDetails" && flight && (
        <FlightDetailsView go={go} back={goBack} flight={flight} onContinue={toSeats} user={user} />
      )}
      {view === "seats" && flight && (
        <SeatsView go={go} back={goBack} flight={flight} pax={search.pax} seats={seats} setSeats={setSeats} onContinue={toPassengerInfo} user={user} />
      )}
      {view === "passengerInfo" && (
        <PassengerInfoView go={go} back={goBack} pax={search.pax} forms={forms} setForms={setForms} onContinue={toPayment} user={user} />
      )}
      {view === "payment" && flight && (
        <PaymentView go={go} back={goBack} total={flight.price * seats.length} onPay={completeBooking} user={user} />
      )}
      {view === "eticket" && booking && <ETicketView go={go} booking={booking} user={user} toast={showToast} />}
      {view === "userDashboard" && <UserDashboardView go={go} back={goBack} user={user} myBooking={booking} onLogout={doLogout} />}
      {view === "admin" && <AdminView go={go} toast={showToast} onLogout={doLogout} />}

      <Toast text={toastMsg} />
    </div>
  );
}
