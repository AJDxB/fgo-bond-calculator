import React, { useEffect, useState } from "react";

// Atlas Academy NA nice_servant endpoint (contains full bond tables)
const SERVANT_LIST_URL = "https://api.atlasacademy.io/export/NA/nice_servant.json";

function getServantName(servant) {
  return servant.name 
    ? `${servant.name}${servant.className ? " (" + servant.className + ")" : ""}`
    : `ID ${servant.id || servant.collectionNo}`;
}

function App() {
  const [servants, setServants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState("");
  const [bondTable, setBondTable] = useState([]);
  const [currentBond, setCurrentBond] = useState(0);
  const [targetLevel, setTargetLevel] = useState(1);
  const [result, setResult] = useState(null);

  // Fetch servants on load
  useEffect(() => {
    fetch(SERVANT_LIST_URL)
      .then(res => res.json())
      .then(data => {
        const filteredServants = data.filter(
          s => s.name && Array.isArray(s.bondGrowth)
        );
        setServants(filteredServants);
        setLoading(false);
        // Log first servant for debug
        if (filteredServants.length) {
          console.log("Sample servant:", filteredServants[0]);
        }
      })
      .catch(() => {
        setServants([]);
        setLoading(false);
        alert("Failed to fetch servant data from Atlas Academy.");
      });
  }, []);

  // Update bond table when servant changes
  useEffect(() => {
    if (!selectedId) {
      setBondTable([]);
      return;
    }
    // Use id as string for comparison since select values are string
    const servant = servants.find(s => String(s.id) === String(selectedId));
    if (servant && Array.isArray(servant.bondGrowth)) {
      // bondGrowth is an array of numbers!
      const bondTotals = servant.bondGrowth.filter(bp => typeof bp === "number");
      console.log("Selected servant:", servant.name, "bondTotals:", bondTotals); // DEBUG!
      setBondTable(bondTotals);
      setTargetLevel(bondTotals.findIndex(bp => bp > currentBond) + 1 || 1);
      setResult(null);
    } else {
      console.log("Servant selected but bondGrowth is invalid:", servant);
      setBondTable([]);
      setResult(null);
    }
  }, [selectedId, servants, currentBond]);

  // Calculate required bond points
  function calculate() {
    if (!bondTable.length || !targetLevel) return;
    const required = bondTable[targetLevel - 1] || 0;
    const needed = Math.max(0, required - currentBond);
    setResult(needed);
  }

  return (
    <div style={{
      maxWidth: 420,
      margin: "40px auto",
      background: "#f9f9f9",
      borderRadius: 12,
      boxShadow: "0 4px 16px #0002",
      padding: 24
    }}>
      <h2 style={{
        textAlign: "center",
        fontWeight: 700,
        fontSize: "2rem",
        marginBottom: 24
      }}>FGO Bond Level Calculator</h2>
      {loading ? (
        <div>Loading servants... (May take up to 30 seconds on first load)</div>
      ) : (
        <>
          {/* Servant Dropdown */}
          <div style={{ marginBottom: 18 }}>
            <label>Servant</label>
            <select
              style={{ width: "100%", padding: 8, marginTop: 4, fontSize: 16 }}
              value={selectedId}
              onChange={e => setSelectedId(e.target.value)}
            >
              <option value="">Select a servant...</option>
              {servants.map(s => (
                <option key={s.id} value={s.id}>
                  {getServantName(s)}
                </option>
              ))}
            </select>
          </div>
          {/* Only show rest if valid bond table */}
          {bondTable.length > 0 && (
            <>
              {/* Bond points input */}
              <div style={{ marginBottom: 16 }}>
                <label>Current Cumulative Bond Points</label>
                <input
                  type="number"
                  min="0"
                  value={currentBond}
                  style={{ width: "100%", padding: 8, marginTop: 4, fontSize: 16 }}
                  onChange={e => setCurrentBond(Number(e.target.value))}
                />
              </div>
              {/* Target bond level */}
              <div style={{ marginBottom: 16 }}>
                <label>Target Bond Level</label>
                <select
                  style={{ width: "100%", padding: 8, marginTop: 4, fontSize: 16 }}
                  value={targetLevel}
                  onChange={e => setTargetLevel(Number(e.target.value))}
                >
                  {bondTable.map((bp, i) =>
                    typeof bp === "number" ? (
                      <option key={i + 1} value={i + 1}>
                        Bond {i + 1} ({bp.toLocaleString()} pts)
                      </option>
                    ) : null
                  )}
                </select>
              </div>
              {/* Calculate button and result */}
              <button
                style={{
                  width: "100%",
                  padding: 12,
                  background: "#4274cb",
                  color: "#fff",
                  borderRadius: 6,
                  border: 0,
                  cursor: "pointer",
                  fontSize: 18,
                  fontWeight: 600
                }}
                onClick={calculate}
              >
                Calculate
              </button>
              {result !== null && (
                <div style={{ textAlign: "center", marginTop: 22, fontSize: 20 }}>
                  {result === 0
                    ? "You already reached this bond level!"
                    : (
                        <>
                          You need{" "}
                          <span style={{ fontWeight: 700 }}>{result.toLocaleString()}</span>{" "}
                          more bond points.
                        </>
                      )}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default App;
