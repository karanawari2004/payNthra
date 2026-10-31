import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

import "./Report.css";

export default function Report({ onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Get report directly from backend response
  const report = location.state?.report;

  const [downloading, setDownloading] = useState(false);
  const [downloadDateTime, setDownloadDateTime] = useState(null);

  // =====================================
  // FORMAT FUNCTIONS
  // =====================================

  const formatMoney = (value) => {
    return `₹${Number(value ?? 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (date) => {
    if (!date) return "-";

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  // =====================================
  // PRINT REPORT
  // =====================================

  const handlePrint = () => {
    window.print();
  };

  // =====================================
  // DOWNLOAD PDF
  // =====================================

  const handleDownloadPDF = async () => {
    const reportElement = document.querySelector(".payslip");

    if (!reportElement) return;

    try {
      setDownloading(true);

      // Set current download date and time
      const currentDateTime = new Date();
      setDownloadDateTime(currentDateTime);

      // Wait for React to update the footer
      await new Promise((resolve) => {
        requestAnimationFrame(() => {
          requestAnimationFrame(resolve);
        });
      });

      const canvas = await html2canvas(reportElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imageData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imageHeight = (canvas.height * pageWidth) / canvas.width;

      const finalHeight = Math.min(imageHeight, pageHeight);

      pdf.addImage(
        imageData,
        "PNG",
        0,
        0,
        pageWidth,
        finalHeight
      );

      pdf.save(`${report.clubName || "Club"}-Report.pdf`);

    } catch (error) {
      console.error("PDF download error:", error);
      alert("Unable to download PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  // =====================================
  // LOGOUT
  // =====================================

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      navigate("/login");
    }
  };

  // =====================================
  // REPORT NOT FOUND
  // =====================================

  if (!report) {
    return (
      <div className="report-empty">
        <h2>Report Not Found</h2>

        <p>Please select a report from the Admin Panel.</p>

        <Link to="/admin">
          Back to Admin Panel
        </Link>
      </div>
    );
  }

  // =====================================
  // BACKEND REPORT VALUES
  // =====================================

  const {
    clubName,
    eventId,
    eventDate,
    eventEndDate,

    topups,
    sales,
    devices,
    days,

    card,
    cash,
    upi,

    coverAmount,
    updateAmount,

    activations,
    activationRate,
    activationAmount,

    manPower,
    manpowerRate,
    manpowerAmount,

    breakage,

    licenceFeeRate,
    licenceFee,

    paymentsTotal,

    subTotal,
    gstRate,
    gst,
    invoiceTotal,

    payable,

    refNo,
  } = report;

  const dateRange =
    eventDate && eventEndDate
      ? `${formatDate(eventDate)} - ${formatDate(eventEndDate)}`
      : formatDate(eventDate);

  // =====================================
  // RENDER REPORT
  // =====================================

  return (
    <div className="report-page">

      {/* HEADER */}

      <div className="report-header">

        <h2>Club Management</h2>

        <div className="report-actions">

          <Link to="/admin" className="report-btn">
            Admin Panel
          </Link>

          <button
            type="button"
            onClick={handlePrint}
            className="report-btn"
          >
            Print Report
          </button>

          <button
            type="button"
            onClick={handleDownloadPDF}
            className="report-btn"
            disabled={downloading}
          >
            {downloading ? "Downloading..." : "Download PDF"}
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="report-btn"
          >
            Logout
          </button>

        </div>
      </div>

      {/* PAYSLIP */}

      <div className="payslip">

        {/* BRAND */}

        <div className="payslip-brand">

          <div className="atomx-text-logo">

            <span className="atomx-name">
              PayNthra
            </span>

            <span className="atomx-highlight">
              atomx
            </span>

          </div>

        </div>

        {/* REPORT HEADING */}

        <div className="payslip-heading">

          <h2>PAYSLIP</h2>

          <h3 className="payslip-club">
            {clubName}
          </h3>

          <p className="payslip-date">
            {dateRange}
          </p>

          <p className="report-description">
            Event ID: {eventId || "-"}
          </p>

        </div>

        {/* SUMMARY */}

        <table className="payslip-table">

          <thead>
            <tr>
              <th colSpan="2" className="table-heading">
                SUMMARY
              </th>
            </tr>
          </thead>

          <tbody>

            <tr>
              <td className="report-label">
                TOPUPS
              </td>

              <td className="report-amount">
                {formatMoney(topups)}
              </td>
            </tr>

            <tr>
              <td className="report-label">
                SALES
              </td>

              <td className="report-amount">
                {formatMoney(sales)}
              </td>
            </tr>

            <tr>
              <td className="report-label">
                DEVICES
              </td>

              <td className="report-amount">
                {devices ?? 0}
              </td>
            </tr>

            <tr>
              <td className="report-label">
                DAYS
              </td>

              <td className="report-amount">
                {days ?? 0}
              </td>
            </tr>

            {/* BREAKAGE */}

            <tr className="bold-row">
              <td className="report-label">
                BREAKAGE

                <small
                  style={{
                    fontSize: "8px",
                    fontWeight: "400",
                    marginLeft: "4px",
                  }}
                >
                  (TOPUPS - SALES - ACTIVATION AMOUNT)
                </small>
              </td>

              <td className="report-amount">
                {formatMoney(breakage)}
              </td>
            </tr>

          </tbody>
        </table>

        {/* AMOUNT WITH PAYNTHRA */}

        <table className="payslip-table">

          <thead>
            <tr>
              <th colSpan="2" className="section-heading">
                AMOUNT WITH PayNthra
              </th>
            </tr>
          </thead>

          <tbody>

            <tr>
              <td className="report-label">
                CARD
              </td>

              <td className="report-amount">
                {formatMoney(card)}
              </td>
            </tr>

            <tr>
              <td className="report-label">
                CASH (HANDOVER)
              </td>

              <td className="report-amount">
                {formatMoney(cash)}
              </td>
            </tr>

            {Number(coverAmount) > 0 && (
              <tr>
                <td className="report-label">
                  COVER (HANDOVER)
                </td>

                <td className="report-amount">
                  {formatMoney(coverAmount)}
                </td>
              </tr>
            )}

            <tr>
              <td className="report-label">
                UPI
              </td>

              <td className="report-amount">
                {formatMoney(upi)}
              </td>
            </tr>

            {Number(updateAmount) > 0 && (
              <tr>
                <td className="report-label">
                  UPDATE AMOUNT
                </td>

                <td className="report-amount">
                  {formatMoney(updateAmount)}
                </td>
              </tr>
            )}

            {/* SUB TOTAL */}

            <tr className="bold-row">
              <td className="report-label">
                SUB TOTAL
              </td>

              <td className="report-amount">
                {formatMoney(paymentsTotal)}
              </td>
            </tr>

            {/* TOTAL */}

            <tr className="bold-row">
              <td className="report-label">
                TOTAL
              </td>

              <td className="report-amount">
                {formatMoney(paymentsTotal)}
              </td>
            </tr>

          </tbody>
        </table>

        {/* INVOICE */}

        <table className="payslip-table">

          <thead>
            <tr>
              <th colSpan="2" className="section-heading">
                INVOICE
              </th>
            </tr>
          </thead>

          <tbody>

            <tr>
            <td className="report-label">
  LICENCE FEE ({licenceFeeRate ?? 0}%)

  <small
    style={{
      fontSize: "8px",
      fontWeight: "400",
      marginLeft: "4px",
    }}
  >
    (TOPUPS × {licenceFeeRate ?? 0}%)
  </small>
</td>

              <td className="report-amount">
                {formatMoney(licenceFee)}
              </td>
            </tr>

            <tr>
              <td className="report-label">
                ACTIVATIONS ({activations ?? 0} × ₹
                {Number(activationRate ?? 0).toLocaleString("en-IN")})
              </td>

              <td className="report-amount">
                {formatMoney(activationAmount)}
              </td>
            </tr>

            <tr>
              <td className="report-label">
                MANPOWER ({manPower ?? 0} × ₹
                {Number(manpowerRate ?? 0).toLocaleString("en-IN")})
              </td>

              <td className="report-amount">
                {formatMoney(manpowerAmount)}
              </td>
            </tr>

            <tr className="bold-row">
              <td className="report-label">
                SUB TOTAL
              </td>

              <td className="report-amount">
                {formatMoney(subTotal)}
              </td>
            </tr>

            <tr>
              <td className="report-label">
                GST ({gstRate ?? 18}%)
              </td>

              <td className="report-amount">
                {formatMoney(gst)}
              </td>
            </tr>

            <tr className="bold-row">
              <td className="report-label">
                TOTAL
              </td>

              <td className="report-amount">
                {formatMoney(invoiceTotal)}
              </td>
            </tr>

          </tbody>
        </table>

        {/* PAYABLE */}

        <table className="payslip-table">

          <tbody>

            <tr className="payable-row">

              <td className="report-label">
                PAYABLE
              </td>

              <td className="report-amount">
                {formatMoney(payable)}
              </td>

            </tr>

          </tbody>
        </table>

        {/* FOOTER */}

        <div className="payslip-footer">

          <p className="payslip-confidential">
            This report is confidential and intended
            for authorized use only.
          </p>

          <p className="payslip-reference">
            Ref: {refNo || "-"}
          </p>

          <p className="payslip-reference">
            Downloaded: {formatDateTime(downloadDateTime)}
          </p>

        </div>

      </div>

    </div>
  );
}