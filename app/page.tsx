"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import QRCode from "qrcode";
import {
  Printer,
  Download,
  Zap,
  Calendar,
  Globe,
  FileText,
  Shield,
  Wrench,
} from "lucide-react";

interface BatteryData {
  batterySrNo: string;
  manufacturingMonth: string;
  ocv: string;
  ir: string;
  website: string;
  brochure: string;
  userManual: string;
  warrantyDocument: string;
}

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 10 }, (_, i) => currentYear + i);

export default function QRBatteryGenerator() {
  const [formData, setFormData] = useState<BatteryData>({
    batterySrNo: "",
    manufacturingMonth: "",
    ocv: "",
    ir: "",
    website: "https://www.fireflyenergy.com/",
    brochure:
      "https://www.fireflyenergy.com/assets/img/pdf/OASIS-MCF-G31-Brochure.pdf",
    userManual:
      "https://www.fireflyenergy.com/assets/img/pdf/user-manual-g31m-2025.pdf",
    warrantyDocument:
      "https://www.fireflyenergy.com/assets/img/pdf/limited-warranty-document-ff-usa-2025.pdf",
  });

  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!formData.batterySrNo.trim())
      newErrors.push("Battery SR NO is required");
    if (!selectedMonth || !selectedYear)
      newErrors.push("Manufacturing Month is required");
    if (!formData.ocv.trim())
      newErrors.push("Open Circuit Voltage (OCV) is required");
    if (!formData.ir.trim())
      newErrors.push("Internal Resistance (IR) is required");
    if (!formData.website.trim()) newErrors.push("Website is required");
    if (!formData.brochure.trim()) newErrors.push("Brochure is required");
    if (!formData.userManual.trim()) newErrors.push("User Manual is required");
    if (!formData.warrantyDocument.trim())
      newErrors.push("Warranty Document is required");

    // Validate numeric fields
    if (formData.ocv && isNaN(Number(formData.ocv))) {
      newErrors.push("OCV must be a valid number");
    }
    if (formData.ir && isNaN(Number(formData.ir))) {
      newErrors.push("IR must be a valid number");
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const generateQRCode = async () => {
    if (!validateForm()) return;

    setIsGenerating(true);

    const manufacturingMonth = `${selectedMonth}-${selectedYear}`;
    const qrData = {
      batterySrNo: formData.batterySrNo,
      website: formData.website,
      "Technical brochure": formData.brochure,
      userManual: formData.userManual,
      warrantyDocument: formData.warrantyDocument,
      "Manufacturing Month & Year": manufacturingMonth,
      "Open Current Voltage (OCV)": `${formData.ocv} V`,
      "Internal Resistance (IR)": `${formData.ir} A`,
    };

    try {
      // Encode the data as a URL to the /view page with data as a query param
      const dataParam = encodeURIComponent(JSON.stringify(qrData));
      const viewUrl = `${window.location.origin}/view?data=${dataParam}`;
      const qrCodeDataUrl = await QRCode.toDataURL(viewUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });
      setQrCodeUrl(qrCodeDataUrl);
    } catch (error) {
      console.error("Error generating QR code:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    if (!qrCodeUrl) return;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Battery QR Code</title>
            <style>
              @media print {
                @page { size: A5; margin: 10mm; }
                body { width: 100%; height: 100%; }
              }
              body { 
                font-family: Arial, sans-serif; 
                display: flex; 
                flex-direction: column; 
                align-items: center; 
                padding: 20px; 
              }
              .header { text-align: center; margin-bottom: 20px; }
              .qr-container { text-align: center; }
              .info { margin-top: 20px; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>Battery Information QR Code</h2>
              <p>SR NO: ${formData.batterySrNo}</p>
            </div>
            <div class="qr-container">
              <img src="${qrCodeUrl}" alt="Battery QR Code" />
            </div>
            <div class="info">
              <p>Manufacturing: ${selectedMonth}-${selectedYear}</p>
              <p>Open Current Volage (OCV): ${formData.ocv}V | Internal Resistance (IR): ${formData.ir}A</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleDownload = () => {
    if (!qrCodeUrl) return;

    const link = document.createElement("a");
    link.download = `battery-qr-${formData.batterySrNo}.png`;
    link.href = qrCodeUrl;
    link.click();
  };

  const handleInputChange = (field: keyof BatteryData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Battery QR Generator
          </h1>
          <p className="text-gray-600">
            Generate QR codes for battery information and documentation
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Battery Information
              </CardTitle>
              <CardDescription>
                Fill in all the required battery details to generate a QR code
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {errors.length > 0 && (
                <Alert variant="destructive">
                  <AlertDescription>
                    <ul className="list-disc list-inside space-y-1">
                      {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label
                  htmlFor="batterySrNo"
                  className="flex items-center gap-1"
                >
                  Battery SR NO <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="batterySrNo"
                  type="text"
                  placeholder="Enter battery serial number"
                  value={formData.batterySrNo}
                  onChange={(e) =>
                    handleInputChange("batterySrNo", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Manufacturing Month <span className="text-red-500">*</span>
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  <Select
                    value={selectedMonth}
                    onValueChange={setSelectedMonth}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem key={month} value={month}>
                          {month}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ocv" className="flex items-center gap-1">
                    Open Current Volage (OCV in Volts){" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="ocv"
                    type="number"
                    step="0.01"
                    placeholder="e.g., 3.7"
                    value={formData.ocv}
                    onChange={(e) => handleInputChange("ocv", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ir" className="flex items-center gap-1">
                    Internal Resistance (IR in Amps){" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="ir"
                    type="number"
                    step="0.001"
                    placeholder="e.g., 0.05"
                    value={formData.ir}
                    onChange={(e) => handleInputChange("ir", e.target.value)}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Documentation Links
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="website" className="flex items-center gap-1">
                    <Globe className="h-4 w-4" />
                    Website <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="website"
                    placeholder="https://example.com"
                    value={formData.website}
                    onChange={(e) =>
                      handleInputChange("website", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brochure" className="flex items-center gap-1">
                    Brochure Link <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="brochure"
                    placeholder="https://example.com/brochure.pdf"
                    value={formData.brochure}
                    onChange={(e) =>
                      handleInputChange("brochure", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="userManual"
                    className="flex items-center gap-1"
                  >
                    <Wrench className="h-4 w-4" />
                    User Manual <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="userManual"
                    placeholder="https://example.com/manual.pdf"
                    value={formData.userManual}
                    onChange={(e) =>
                      handleInputChange("userManual", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="warrantyDocument"
                    className="flex items-center gap-1"
                  >
                    <Shield className="h-4 w-4" />
                    Warranty Document <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="warrantyDocument"
                    placeholder="https://example.com/warranty.pdf"
                    value={formData.warrantyDocument}
                    onChange={(e) =>
                      handleInputChange("warrantyDocument", e.target.value)
                    }
                  />
                </div>
              </div>

              <Button
                onClick={generateQRCode}
                className="w-full"
                size="lg"
                disabled={isGenerating}
              >
                {isGenerating ? "Generating..." : "Generate QR Code"}
              </Button>
            </CardContent>
          </Card>

          {/* QR Code Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Generated QR Code</CardTitle>
              <CardDescription>
                Scan this QR code to view battery information
              </CardDescription>
            </CardHeader>
            <CardContent>
              {qrCodeUrl ? (
                <div className="space-y-6">
                  <div className="flex justify-center">
                    <div className="p-4 bg-white rounded-lg shadow-inner">
                      <img
                        src={qrCodeUrl || "/placeholder.svg"}
                        alt="Battery QR Code"
                        className="w-64 h-64"
                      />
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">QR Code Contains:</h4>
                    <div className="text-sm space-y-1">
                      <p>
                        <strong>Battery SR NO:</strong> {formData.batterySrNo}
                      </p>
                      <p>
                        <strong>Manufacturing Month & Year:</strong> {selectedMonth}-
                        {selectedYear}
                      </p>
                      <p>
                        <strong>Open Current Voltage (OCV):</strong>{" "}
                        {formData.ocv}V
                      </p>
                      <p>
                        <strong>Internal Resistance (IR):</strong> {formData.ir}
                        A
                      </p>
                      <p>
                        <strong>Website:</strong> {formData.website}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handlePrint}
                      variant="outline"
                      className="flex-1 bg-transparent"
                    >
                      <Printer className="h-4 w-4 mr-2" />
                      Print
                    </Button>
                    <Button
                      onClick={handleDownload}
                      variant="outline"
                      className="flex-1 bg-transparent"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <Zap className="h-12 w-12 mb-4 opacity-50" />
                  <p>
                    Fill in the form and click "Generate QR Code" to create your
                    QR code
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
