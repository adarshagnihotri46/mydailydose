import React, { useEffect, useState } from "react";
import SearchFilter from "../utility/SearchFilter";
import { fetchCameras, updateCameraStatus } from "../services/cameraApi";
import Pagination from "../utility/Pagination";
import { TbCloudCheck } from "react-icons/tb";
import { AiOutlineDatabase } from "react-icons/ai";
import CircularProgressBar from "./progress";
import { MdBlock } from "react-icons/md";
import { RiCheckboxCircleLine } from "react-icons/ri";
import { BiSearch } from "react-icons/bi";

const CameraTable = () => {
  const [cameras, setCameras] = useState([]);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [filteredCameras, setFilteredCameras] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  const loadCameras = async () => {
    try {
      const response = await fetchCameras();
      console.log("API Response:", response); // Log the API response
      if (response.data && Array.isArray(response.data)) {
        setCameras(response.data);
        applySearchFilter(response.data);
      } else {
        setCameras([]);
        setFilteredCameras([]);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Apply search filter to cameras
  const applySearchFilter = (camerasData) => {
    if (searchQuery.trim()) {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filteredData = camerasData.filter(
        (camera) =>
          camera.name.toLowerCase().includes(lowercasedQuery) ||
          camera.location.toLowerCase().includes(lowercasedQuery) ||
          camera.status.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredCameras(filteredData);
      setTotalItems(filteredData.length); // Update totalItems based on filtered data
    } else {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const paginatedData = camerasData.slice(
        startIndex,
        startIndex + itemsPerPage
      );
      setFilteredCameras(paginatedData);
      setTotalItems(camerasData.length);
    }
  };

  useEffect(() => {
    loadCameras();
  }, []);

  useEffect(() => {
    applySearchFilter(cameras); // Apply search filter when searchQuery changes
  }, [searchQuery, cameras, currentPage]);

  const sortData = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    const sortedCameras = [...filteredCameras].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setFilteredCameras(sortedCameras);
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    const startIndex = (pageNumber - 1) * itemsPerPage;
    const paginatedData = cameras.slice(startIndex, startIndex + itemsPerPage);
    setFilteredCameras(paginatedData);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
      await updateCameraStatus(id, newStatus);
      setCameras((prev) =>
        prev.map((camera) =>
          camera.id === id ? { ...camera, status: newStatus } : camera
        )
      );
      applySearchFilter(cameras); // Re-apply the search filter after status change
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) return <div>Error: {error}</div>;

  if (!Array.isArray(cameras)) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="container">
        <div className="search-filter" style={{ position: "relative", display: "inline-block" }}>
          <input
            type="text"
            placeholder="Search Cameras"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "300px",
              padding: "8px 30px 8px 10px", 
              marginBottom: "10px",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: "10px", 
              top: "50%",
              transform: "translateY(-50%)", 
            }}
          >
            <BiSearch />
          </div>
        </div>

        <div className="sort-buttons">
          <button className="sort-btn" onClick={() => sortData("name")}>
            Sort by Name
          </button>
          <button className="sort-btn" onClick={() => sortData("location")}>
            Sort by Location
          </button>
          <button className="sort-btn" onClick={() => sortData("status")}>
            Sort by Status
          </button>
        </div>

        <div className="table-container">
          <table className="camera-table">
            <thead>
              <tr>
                <th className="table-header">
                  <input
                   style={{marginLeft:"23px"}}
                    className="camera-checkbox"
                    type="checkbox"
                    name=""
                    id=""
                  />
                </th>
                <th className="table-header">Name</th>
                <th className="table-header">Health</th>
                <th className="table-header">Location</th>
                <th className="table-header">Recorder</th>
                <th className="table-header">Tasks</th>
                <th className="table-header">Status</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCameras.length > 0 ? (
                filteredCameras.map((camera) => {
                  const isOnline = camera.current_status === "Online";
                  const showWarningEmoji = camera.hasWarning ? "⚠️" : ""; // Warning emoji

                  return (
                    <tr key={camera.id} className="table-row">
                      <td className="table-cell actions-cell">
                        <input
                          type="checkbox"
                          className="camera-checkbox"
                          onChange={(e) => handleCheckboxChange(e, camera.id)}
                        />
                      </td>

                      <td className="table-cell df center ">
                        <div className={isOnline ? "ball" : ""}></div>
                        <div>
                          {camera.name} {showWarningEmoji}
                        </div>
                      </td>
                      <td className="table-cell center">
                        <div className="df center">
                          <TbCloudCheck size={20} />
                          <CircularProgressBar
                            progress={72}
                            letter={camera.health.cloud}
                            size={30}
                          />
                          <AiOutlineDatabase size={20} />
                          <CircularProgressBar
                            progress={72}
                            letter={camera.health.device}
                            size={30}
                          />
                        </div>
                      </td>
                      <td className="table-cell">{camera.location}</td>
                      <td className="table-cell">{camera.recorder || "N/A"}</td>
                      <td className="table-cell">{camera.tasks} Tasks</td>
                      <td className="table-cell">
                        <button
                          className={`status-btn ${
                            camera.status === "Active" ? "active" : "inactive"
                          }`}
                          onClick={() => toggleStatus(camera.id, camera.status)}
                        >
                          {camera.status === "Active" ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="table-cell">
                        {camera.status === "Active" ? (
                          <RiCheckboxCircleLine style={{ color: "green" }} />
                        ) : (
                          <MdBlock style={{ color: "tomato" }} />
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr className="no-data-row">
                  <td className="no-data-cell" colSpan="7">
                    No cameras found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination-container">
          <Pagination
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={paginate}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </div>
      </div>
    </>
  );
};

export default CameraTable;
