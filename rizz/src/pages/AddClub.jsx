import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./AddClub.css";

export default function AddClub() {
  const navigate = useNavigate();

  const [clubName, setClubName] = useState("");
  const [licenceFee, setLicenceFee] = useState("");
  const [activationRate, setActivationRate] = useState("");
  const [manPowerRate, setManPowerRate] = useState("");
  const [gstRate, setGstRate] = useState("");

  const [clubs, setClubs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  
  const resetForm = () => {
    setEditingId(null);
    setClubName("");
    setLicenceFee("");
    setActivationRate("");
    setManPowerRate("");
    setGstRate("");
  };


  const fetchClubs = useCallback(async () => {
    try {
      setError("");

      const response = await api.get("/clubs");

      if (response.data.success) {
        setClubs(response.data.data || []);
      } else {
        setError(response.data.message || "Unable to fetch clubs.");
      }
    } catch (error) {
      console.error("Fetch clubs error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to fetch clubs. Please check backend connection."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClubs();
  }, [fetchClubs]);

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !clubName.trim() ||
      licenceFee === "" ||
      activationRate === "" ||
      manPowerRate === "" ||
      gstRate === ""
    ) {
      alert("Please fill in all fields.");
      return;
    }

    const licence = Number(licenceFee);
    const activation = Number(activationRate);
    const manpower = Number(manPowerRate);
    const gst = Number(gstRate);

    if (
      [licence, activation, manpower, gst].some(
        (value) => !Number.isFinite(value) || value < 0
      )
    ) {
      alert("Please enter valid non-negative numbers.");
      return;
    }

    if (licence > 100 || gst > 100) {
      alert("Licence Fee and GST must be between 0 and 100%.");
      return;
    }

    const clubData = {
      clubName: clubName.trim(),
      licenceFee: licence,
      activationRate: activation,
      manPowerRate: manpower,
      gstRate: gst,
    };

    const isEditing = Boolean(editingId);

    try {
      setSaving(true);
      setError("");

      let response;

      if (isEditing) {
        
        response = await api.put(`/clubs/${editingId}`, clubData);
      } else {
      
        response = await api.post("/clubs", clubData);
      }

      if (response.data.success) {
        alert(
          isEditing
            ? "Club updated successfully!"
            : "Club added successfully!"
        );

        resetForm();
        await fetchClubs();
      } else {
        alert(response.data.message || "Operation failed.");
      }
    } catch (error) {
      console.error("Save club error:", error.response?.data || error);

      alert(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  
  const handleEdit = (club) => {
    setEditingId(club._id);

    setClubName(club.clubName || "");
    setLicenceFee(String(club.licenceFee ?? ""));
    setActivationRate(String(club.activationRate ?? ""));
    setManPowerRate(String(club.manPowerRate ?? ""));
    setGstRate(String(club.gstRate ?? ""));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  
  const handleDelete = async (id, name) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${name}"?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");

      const response = await api.delete(`/clubs/${id}`);

      if (response.data.success) {
        setClubs((previousClubs) =>
          previousClubs.filter((club) => club._id !== id)
        );

        if (editingId === id) {
          resetForm();
        }

        alert("Club deleted successfully.");
      } else {
        alert(response.data.message || "Unable to delete club.");
      }
    } catch (error) {
      console.error("Delete club error:", error);

      alert(
        error.response?.data?.message ||
          "Unable to delete club. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="add-club-page">
      <div className="add-club-card">

        <h1>{editingId ? "Update Club" : "Add New Club"}</h1>

        <p>
          {editingId
            ? "Update the selected club details."
            : "Enter the details of your new club."}
        </p>

        
        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label htmlFor="clubName">Club Name</label>

            <input
              id="clubName"
              type="text"
              placeholder="Enter club name"
              value={clubName}
              onChange={(e) => setClubName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="licenceFee">Licence Fee (%)</label>

            <input
              id="licenceFee"
              type="number"
              placeholder="Enter licence fee"
              value={licenceFee}
              onChange={(e) => setLicenceFee(e.target.value)}
              min="0"
              max="100"
              step="any"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="activationRate">Activation Rate</label>

            <input
              id="activationRate"
              type="number"
              placeholder="Enter activation rate"
              value={activationRate}
              onChange={(e) => setActivationRate(e.target.value)}
              min="0"
              step="any"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="manPowerRate">Manpower Rate</label>

            <input
              id="manPowerRate"
              type="number"
              placeholder="Enter manpower rate"
              value={manPowerRate}
              onChange={(e) => setManPowerRate(e.target.value)}
              min="0"
              step="any"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="gstRate">GST (%)</label>

            <input
              id="gstRate"
              type="number"
              placeholder="Enter GST percentage"
              value={gstRate}
              onChange={(e) => setGstRate(e.target.value)}
              min="0"
              max="100"
              step="any"
              required
            />
          </div>

          
          <div className="add-club-actions">

            <button
              type="submit"
              className="add-club-save"
              disabled={saving}
            >
              {saving
                ? editingId
                  ? "Updating..."
                  : "Saving..."
                : editingId
                  ? "Update Club"
                  : "Add Club"}
            </button>

            {editingId && (
              <button
                type="button"
                className="add-club-cancel"
                onClick={resetForm}
                disabled={saving}
              >
                Cancel Update
              </button>
            )}

            <button
              type="button"
              className="add-club-cancel"
              onClick={() => navigate("/admin")}
            >
              Back to Admin
            </button>

          </div>
        </form>

        
        <div className="club-list-section">

          <h2>Club List</h2>

          {error && <p className="club-error">{error}</p>}

          {loading ? (
            <p>Loading clubs...</p>
          ) : clubs.length === 0 ? (
            <p>No clubs found.</p>
          ) : (

            <div className="club-table-wrapper">

              <table className="club-table">

                <thead>
                  <tr>
                    <th>Club Name</th>
                    <th>Licence Fee (%)</th>
                    <th>Activation Rate</th>
                    <th>Manpower Rate</th>
                    <th>GST (%)</th>
                    <th>Update</th>
                    <th>Delete</th>
                  </tr>
                </thead>

                <tbody>

                  {clubs.map((club) => (

                    <tr key={club._id}>

                      <td>{club.clubName}</td>

                      <td>{club.licenceFee}%</td>

                      <td>{club.activationRate}</td>

                      <td>{club.manPowerRate}</td>

                      <td>{club.gstRate}%</td>

                      <td>
                        <button
                          type="button"
                          className="club-update-btn"
                          onClick={() => handleEdit(club)}
                          disabled={saving || deletingId !== null}
                        >
                          Update
                        </button>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="club-delete-btn"
                          onClick={() =>
                            handleDelete(club._id, club.clubName)
                          }
                          disabled={
                            deletingId === club._id ||
                            saving ||
                            deletingId !== null
                          }
                        >
                          {deletingId === club._id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}