
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./Admin.css";

export default function Admin({ onLogout }) {
  const navigate = useNavigate();

  
  const [clubName, setClubName] = useState("");
  const [clubs, setClubs] = useState([]);
  const [clubsLoading, setClubsLoading] = useState(false);

  
  const [eventDate, setEventDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [eventId, setEventId] = useState("");

  
  const [topUps, setTopUps] = useState("");
  const [sales, setSales] = useState("");
  const [devices, setDevices] = useState("");
  const [days, setDays] = useState("");

  
  const [card, setCard] = useState("");
  const [cash, setCash] = useState("");
  const [upi, setUpi] = useState("");


  const [activations, setActivations] = useState("");
  const [activationRate, setActivationRate] = useState("");

  const [manPower, setManPower] = useState("");
  const [manpowerRate, setManpowerRate] = useState("");

  
  const [licenceFeeRate, setLicenceFeeRate] = useState("");
  const [gstRate, setGstRate] = useState("");

  
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  
  const handleAddClub = () => {
    navigate("/add-club");
  };

  
  const fetchClubs = useCallback(async () => {
    try {
      setClubsLoading(true);

      const response = await api.get("/clubs");

      if (response.data?.success) {
        setClubs(
          Array.isArray(response.data.data) ? response.data.data : []
        );
      } else {
        setClubs([]);
        console.error(
          "Unable to fetch clubs:",
          response.data?.message
        );
      }
    } catch (error) {
      console.error(
        "Fetch clubs error:",
        error.response?.data || error.message
      );

      setClubs([]);
    } finally {
      setClubsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClubs();
  }, [fetchClubs]);

  // Automatically populate rates when a club is selected
  const handleClubChange = (e) => {
    const selectedClubName = e.target.value;

    setClubName(selectedClubName);

    const selectedClub = clubs.find(
      (club) => club.clubName === selectedClubName
    );

    if (selectedClub) {
      setLicenceFeeRate(String(selectedClub.licenceFee ?? ""));
      setActivationRate(String(selectedClub.activationRate ?? ""));
      setManpowerRate(String(selectedClub.manPowerRate ?? ""));
      setGstRate(String(selectedClub.gstRate ?? ""));
    } else {
      setLicenceFeeRate("");
      setActivationRate("");
      setManpowerRate("");
      setGstRate("");
    }
  };

  const handleLogout = async () => {
    try {
      await api.post("/logout");
    } catch (error) {
      console.error(
        "Logout API error:",
        error.response?.data || error.message
      );
    } finally {
      sessionStorage.removeItem("isLoggedIn");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userRole");

      if (onLogout) {
        onLogout();
      } else {
        navigate("/login", { replace: true });
      }
    }
  };

  // Fetch report history
  const fetchHistory = useCallback(async () => {
    try {
      setHistoryLoading(true);

      const response = await api.get("/admin");

      if (response.data?.success) {
        const reports =
          response.data.reports ?? response.data.data;

        setHistory(Array.isArray(reports) ? reports : []);
      } else {
        setHistory([]);

        console.error(
          "History response:",
          response.data?.message || "Unable to fetch reports."
        );
      }
    } catch (error) {
      console.error(
        "Fetch history error:",
        error.response?.data || error.message
      );

      setHistory([]);

      alert(
        error.response?.data?.message ||
          "Unable to fetch report history. Please check the server connection."
      );
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // Reset report form
  const resetForm = () => {
    setClubName("");
    setEventDate("");
    setEventEndDate("");
    setEventId("");

    setTopUps("");
    setSales("");
    setDevices("");
    setDays("");

    setCard("");
    setCash("");
    setUpi("");

    setActivations("");
    setActivationRate("");

    setManPower("");
    setManpowerRate("");

    setLicenceFeeRate("");
    setGstRate("");
  };

  // Create report
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !clubName.trim() ||
      !eventId.trim() ||
      !eventDate ||
      !eventEndDate
    ) {
      alert(
        "Please select a club and enter the event ID, start date, and end date."
      );
      return;
    }

    const startDate = new Date(`${eventDate}T00:00:00`);
    const endDate = new Date(`${eventEndDate}T00:00:00`);

    if (
      Number.isNaN(startDate.getTime()) ||
      Number.isNaN(endDate.getTime())
    ) {
      alert("Please enter valid event dates.");
      return;
    }

    if (endDate < startDate) {
      alert("Event end date cannot be earlier than the start date.");
      return;
    }

    if (
      activationRate.trim() === "" ||
      manpowerRate.trim() === "" ||
      licenceFeeRate.trim() === "" ||
      gstRate.trim() === ""
    ) {
      alert("Please select a club with all four rates configured.");
      return;
    }

    const numericValues = {
      topups: Number(topUps || 0),
      sales: Number(sales || 0),
      devices: Number(devices || 0),
      days: Number(days || 1),

      card: Number(card || 0),
      cash: Number(cash || 0),
      upi: Number(upi || 0),

      activations: Number(activations || 0),
      activationRate: Number(activationRate),

      manPower: Number(manPower || 0),
      manpowerRate: Number(manpowerRate),

      licenceFeeRate: Number(licenceFeeRate),
      gstRate: Number(gstRate),
    };

    for (const [field, value] of Object.entries(numericValues)) {
      if (!Number.isFinite(value) || value < 0) {
        alert(`${field} must be a valid non-negative number.`);
        return;
      }
    }

    if (
      numericValues.licenceFeeRate > 100 ||
      numericValues.gstRate > 100
    ) {
      alert("Licence Fee and GST rates cannot exceed 100%.");
      return;
    }

    if (!Number.isInteger(numericValues.devices)) {
      alert("Devices must be a whole number.");
      return;
    }

    if (
      !Number.isInteger(numericValues.days) ||
      numericValues.days < 1
    ) {
      alert("Days must be a whole number greater than zero.");
      return;
    }

    if (
      !Number.isInteger(numericValues.activations) ||
      !Number.isInteger(numericValues.manPower)
    ) {
      alert("Activations and manpower must be whole numbers.");
      return;
    }

    const formData = {
      clubName: clubName.trim(),
      eventId: eventId.trim(),
      eventDate,
      eventEndDate,
      ...numericValues,
    };

    try {
      setLoading(true);

      console.log("Submitting report:", formData);

      const response = await api.post("/admin", formData);

      if (response.data?.success) {
        console.log(
          "Saved report returned by backend:",
          response.data.report
        );

        alert("Report saved successfully!");

        resetForm();

        await fetchHistory();
      } else {
        alert(response.data?.message || "Unable to save report.");
      }
    } catch (error) {
      console.error(
        "Save report error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Unable to save report. Please check the server connection."
      );
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return "-";

    const dateString = String(date);

    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const [year, month, day] = dateString.split("-");

      const monthName = new Date(
        `${dateString}T00:00:00`
      ).toLocaleDateString("en-IN", {
        month: "short",
      });

      return `${day} ${monthName} ${year}`;
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // View selected report
  const handleView = async (id) => {
    if (!id) {
      alert("Report ID is missing.");
      return;
    }

    try {
      const response = await api.get(`/admin/${id}`);

      const selectedReport =
        response.data?.report ?? response.data?.data;

      if (response.data?.success && selectedReport) {
        console.log("Selected report:", selectedReport);

        navigate("/report", {
          state: {
            report: selectedReport,
          },
        });
      } else {
        alert(
          response.data?.message ||
            "Unable to load the selected report."
        );
      }
    } catch (error) {
      console.error(
        "View report error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Unable to open the report. Please check the server connection."
      );
    }
  };

  // Delete report
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this report?"
    );

    if (!confirmed) return;

    try {
      const response = await api.delete(`/admin/${id}`);

      if (response.data?.success) {
        setHistory((previousHistory) =>
          previousHistory.filter((item) => item._id !== id)
        );

        alert("Report deleted successfully.");
      } else {
        alert(
          response.data?.message || "Unable to delete report."
        );
      }
    } catch (error) {
      console.error(
        "Delete report error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Unable to delete the report."
      );
    }
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h1>Club Management</h1>

        <div className="admin-actions">
          <button
            type="button"
            className="admin-report-link"
            onClick={() => {
              if (history.length === 0) {
                alert(
                  "No reports available. Please create a report first."
                );
                return;
              }

              handleView(history[0]._id);
            }}
          >
            View Latest Report
          </button>

          <button
            type="button"
            className="admin-logout-btn"
            onClick={handleAddClub}
          >
            Add Club
          </button>

          <button
            type="button"
            className="admin-logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </header>

      <div className="admin-content">
        <form className="admin-form" onSubmit={handleSubmit}>
          <h2>Create Club Report</h2>

          {/* CLUB NAME DROPDOWN */}
          <div className="form-group">
            <label htmlFor="clubName">Club Name</label>

            <select
              id="clubName"
              value={clubName}
              onChange={handleClubChange}
              required
              disabled={clubsLoading}
            >
              <option value="">
                {clubsLoading ? "Loading clubs..." : "Select a club"}
              </option>

              {clubs.map((club) => (
                <option key={club._id} value={club.clubName}>
                  {club.clubName}
                </option>
              ))}
            </select>

            {!clubsLoading && clubs.length === 0 && (
              <small>
                No clubs found. Please add a club first.
              </small>
            )}
          </div>

          {/* EVENT DETAILS */}
          <div className="form-group">
            <label htmlFor="eventId">Event ID</label>

            <input
              type="text"
              id="eventId"
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              placeholder="Enter event ID"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="eventDate">Event Start Date</label>

            <input
              type="date"
              id="eventDate"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="eventEndDate">Event End Date</label>

            <input
              type="date"
              id="eventEndDate"
              value={eventEndDate}
              min={eventDate || undefined}
              onChange={(e) => setEventEndDate(e.target.value)}
              required
            />
          </div>

          <hr />

          <h3>Sales Details</h3>

          <div className="form-group">
            <label htmlFor="topUps">Top Ups</label>

            <input
              type="number"
              id="topUps"
              min="0"
              step="0.01"
              value={topUps}
              onChange={(e) => setTopUps(e.target.value)}
              placeholder="Enter top ups"
            />
          </div>

          <div className="form-group">
            <label htmlFor="sales">Sales</label>

            <input
              type="number"
              id="sales"
              min="0"
              step="0.01"
              value={sales}
              onChange={(e) => setSales(e.target.value)}
              placeholder="Enter sales"
            />
          </div>

          <div className="form-group">
            <label htmlFor="devices">Devices</label>

            <input
              type="number"
              id="devices"
              min="0"
              step="1"
              value={devices}
              onChange={(e) => setDevices(e.target.value)}
              placeholder="Enter number of devices"
            />
          </div>

          <div className="form-group">
            <label htmlFor="days">Days</label>

            <input
              type="number"
              id="days"
              min="1"
              step="1"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              placeholder="Enter number of days"
            />
          </div>

          <hr />

          <h3>Payment Details</h3>

          <div className="form-group">
            <label htmlFor="card">Card</label>

            <input
              type="number"
              id="card"
              min="0"
              step="0.01"
              value={card}
              onChange={(e) => setCard(e.target.value)}
              placeholder="Enter card amount"
            />
          </div>

          <div className="form-group">
            <label htmlFor="cash">Cash</label>

            <input
              type="number"
              id="cash"
              min="0"
              step="0.01"
              value={cash}
              onChange={(e) => setCash(e.target.value)}
              placeholder="Enter cash amount"
            />
          </div>

          <div className="form-group">
            <label htmlFor="upi">UPI</label>

            <input
              type="number"
              id="upi"
              min="0"
              step="0.01"
              value={upi}
              onChange={(e) => setUpi(e.target.value)}
              placeholder="Enter UPI amount"
            />
          </div>

          <hr />

          <h3>Activation &amp; Manpower Details</h3>

          <div className="form-group">
            <label htmlFor="activations">
              Activations (Quantity)
            </label>

            <input
              type="number"
              id="activations"
              min="0"
              step="1"
              value={activations}
              onChange={(e) => setActivations(e.target.value)}
              placeholder="Enter number of activations"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="activationRate">
              Activation Rate (₹ per activation)
            </label>

            <input
              type="number"
              id="activationRate"
              min="0"
              step="0.001"
              value={activationRate}
              placeholder="Automatically filled from selected club"
              readOnly
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="manPower">Manpower (Quantity)</label>

            <input
              type="number"
              id="manPower"
              min="0"
              step="1"
              value={manPower}
              onChange={(e) => setManPower(e.target.value)}
              placeholder="Enter manpower quantity"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="manpowerRate">
              Manpower Rate (₹ per unit)
            </label>

            <input
              type="number"
              id="manpowerRate"
              min="0"
              step="0.01"
              value={manpowerRate}
              placeholder="Automatically filled from selected club"
              readOnly
              required
            />
          </div>

          <hr />

          <h3>Fee &amp; Tax Rates</h3>

          <div className="form-group">
            <label htmlFor="licenceFeeRate">
              Licence Fee Rate (%)
            </label>

            <input
              type="number"
              id="licenceFeeRate"
              min="0"
              max="100"
              step="0.01"
              value={licenceFeeRate}
              placeholder="Automatically filled from selected club"
              readOnly
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="gstRate">GST Rate (%)</label>

            <input
              type="number"
              id="gstRate"
              min="0"
              max="100"
              step="0.01"
              value={gstRate}
              placeholder="Automatically filled from selected club"
              readOnly
              required
            />
          </div>

          <button
            type="submit"
            className="admin-save-btn"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Report"}
          </button>
        </form>

        {/* REPORT HISTORY */}
        <section className="history-section">
          <div className="history-heading">
            <h2>Report History</h2>

            <button
              type="button"
              onClick={fetchHistory}
              disabled={historyLoading}
            >
              {historyLoading ? "Loading..." : "Refresh"}
            </button>
          </div>

          {historyLoading ? (
            <p>Loading report history...</p>
          ) : history.length === 0 ? (
            <p>No reports found.</p>
          ) : (
            <div className="history-table-wrapper">
              <table className="history-table">
                <thead>
                  <tr>
                    <th>Club Name</th>
                    <th>Event ID</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>View</th>
                    <th>Delete</th>
                  </tr>
                </thead>

                <tbody>
                  {history.map((item) => (
                    <tr key={item._id}>
                      <td>{item.clubName || "-"}</td>
                      <td>{item.eventId || "-"}</td>
                      <td>{formatDate(item.eventDate)}</td>
                      <td>{formatDate(item.eventEndDate)}</td>

                      <td>
                        <button
                          type="button"
                          className="history-view-btn"
                          onClick={() => handleView(item._id)}
                        >
                          View
                        </button>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="history-delete-btn"
                          onClick={() => handleDelete(item._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
