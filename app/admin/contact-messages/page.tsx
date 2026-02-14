"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

interface ContactMessage {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    status: "new" | "read";
    createdAt: string;
}

export default function ContactMessagesPage() {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [filteredMessages, setFilteredMessages] = useState<ContactMessage[]>([]);
    const [filter, setFilter] = useState<"all" | "new" | "read">("all");
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/admin/login");
        } else if (status === "authenticated" && session?.user?.role !== "admin") {
            router.push("/home");
        }
    }, [status, session, router]);

    useEffect(() => {
        fetchMessages();
    }, []);

    useEffect(() => {
        if (filter === "all") {
            setFilteredMessages(messages);
        } else {
            setFilteredMessages(messages.filter((msg) => msg.status === filter));
        }
    }, [filter, messages]);

    const fetchMessages = async () => {
        try {
            const response = await fetch("/api/admin/contact-messages");
            const data = await response.json();

            if (response.ok) {
                setMessages(data.messages);
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, newStatus: "new" | "read") => {
        try {
            const response = await fetch("/api/admin/contact-messages", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id, status: newStatus }),
            });

            if (response.ok) {
                setMessages(
                    messages.map((msg) =>
                        msg._id === id ? { ...msg, status: newStatus } : msg
                    )
                );
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const toggleExpand = (id: string) => {
        if (expandedId === id) {
            setExpandedId(null);
        } else {
            setExpandedId(id);
            // Mark as read when expanded
            const message = messages.find((msg) => msg._id === id);
            if (message && message.status === "new") {
                updateStatus(id, "read");
            }
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (status === "loading" || loading) {
        return (
            <div className="admin-loading">
                <div className="spinner"></div>
                <p>Loading contact messages...</p>
            </div>
        );
    }

    if (!session || session.user.role !== "admin") {
        return null;
    }

    const newCount = messages.filter((msg) => msg.status === "new").length;

    return (
        <div className="admin-container">
            <div className="admin-header">
                <div>
                    <h1>Contact Messages</h1>
                    <p className="admin-subtitle">
                        {messages.length} total messages
                        {newCount > 0 && ` (${newCount} unread)`}
                    </p>
                </div>
                <button onClick={() => router.push("/admin")} className="btn-secondary">
                    Back to Dashboard
                </button>
            </div>

            {/* Filter Tabs */}
            <div className="filter-tabs">
                <button
                    onClick={() => setFilter("all")}
                    className={filter === "all" ? "tab-active" : "tab"}
                >
                    All ({messages.length})
                </button>
                <button
                    onClick={() => setFilter("new")}
                    className={filter === "new" ? "tab-active" : "tab"}
                >
                    New ({messages.filter((m) => m.status === "new").length})
                </button>
                <button
                    onClick={() => setFilter("read")}
                    className={filter === "read" ? "tab-active" : "tab"}
                >
                    Read ({messages.filter((m) => m.status === "read").length})
                </button>
            </div>

            {/* Messages List */}
            <div className="messages-list">
                {filteredMessages.length === 0 ? (
                    <div className="empty-state">
                        <p>No messages found</p>
                    </div>
                ) : (
                    filteredMessages.map((message) => (
                        <div
                            key={message._id}
                            className={`message-card ${message.status === "new" ? "message-new" : ""}`}
                        >
                            <div
                                onClick={() => toggleExpand(message._id)}
                                className="message-header"
                            >
                                <div className="message-info">
                                    <div className="message-title-row">
                                        <h3>{message.subject}</h3>
                                        {message.status === "new" && (
                                            <span className="new-badge">New</span>
                                        )}
                                    </div>
                                    <p className="message-from">
                                        From: <strong>{message.name}</strong> ({message.email})
                                    </p>
                                    <p className="message-date">{formatDate(message.createdAt)}</p>
                                </div>
                                <button className="expand-btn">
                                    {expandedId === message._id ? "▲" : "▼"}
                                </button>
                            </div>

                            {expandedId === message._id && (
                                <div className="message-body">
                                    <div className="message-details">
                                        <div className="detail-row">
                                            <strong>Email:</strong> <a href={`mailto:${message.email}`}>{message.email}</a>
                                        </div>
                                        {message.phone && (
                                            <div className="detail-row">
                                                <strong>Phone:</strong> <a href={`tel:${message.phone}`}>{message.phone}</a>
                                            </div>
                                        )}
                                        <div className="detail-row">
                                            <strong>Message:</strong>
                                        </div>
                                        <div className="message-content">{message.message}</div>
                                    </div>

                                    <div className="message-actions">
                                        {message.status === "new" ? (
                                            <button
                                                onClick={() => updateStatus(message._id, "read")}
                                                className="btn-mark-read"
                                            >
                                                Mark as Read
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => updateStatus(message._id, "new")}
                                                className="btn-mark-unread"
                                            >
                                                Mark as Unread
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
