import React, { useState, useCallback, useRef } from "react";
import { Upload, Download, Save, Undo, Redo } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

const AdvancedGradientGenerator = () => {
  const canvasRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [gradientUrl, setGradientUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [controlPoints, setControlPoints] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [settings, setSettings] = useState({
    gradientType: "linear",
    angle: 45,
    smoothing: 50,
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    noise: 0,
    resolution: "1920x1080",
    autoUpdate: true,
    snapToEdges: true,
    showGrid: true,
  });
  const [presets, setPresets] = useState([]);
  const [activePreset, setActivePreset] = useState(null);

  // Canvas interaction handlers
  const handleCanvasClick = useCallback(
    (e) => {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      if (settings.snapToEdges) {
        if (x < 10) x = 0;
        if (x > 90) x = 100;
        if (y < 10) y = 0;
        if (y > 90) y = 100;
      }

      const newPoint = {
        id: Date.now(),
        x,
        y,
        color: getColorAtPoint(x, y),
        opacity: 100,
      };

      setControlPoints((prev) => [...prev, newPoint]);
      addToHistory();
    },
    [settings.snapToEdges]
  );

  const moveControlPoint = useCallback(
    (id, newX, newY) => {
      setControlPoints((prev) =>
        prev.map((point) =>
          point.id === id ? { ...point, x: newX, y: newY } : point
        )
      );
      if (settings.autoUpdate) generateGradient();
    },
    [settings.autoUpdate]
  );

  // Color sampling from image
  const getColorAtPoint = useCallback(
    (x, y) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.src = previewUrl;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const pixelData = ctx.getImageData(
        (x / 100) * canvas.width,
        (y / 100) * canvas.height,
        1,
        1
      ).data;

      return `rgb(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]})`;
    },
    [previewUrl]
  );

  // History management
  const addToHistory = useCallback(() => {
    const newState = {
      controlPoints: [...controlPoints],
      settings: { ...settings },
    };

    setHistory((prev) => [...prev.slice(0, historyIndex + 1), newState]);
    setHistoryIndex((prev) => prev + 1);
  }, [controlPoints, settings, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1);
      const prevState = history[historyIndex - 1];
      setControlPoints(prevState.controlPoints);
      setSettings(prevState.settings);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prev) => prev + 1);
      const nextState = history[historyIndex + 1];
      setControlPoints(nextState.controlPoints);
      setSettings(nextState.settings);
    }
  }, [history, historyIndex]);

  // Gradient generation
  const generateGradient = useCallback(() => {
    if (controlPoints.length < 2) return;

    const canvas = document.createElement("canvas");
    const [width, height] = settings.resolution.split("x").map(Number);
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    let gradient;
    if (settings.gradientType === "linear") {
      const angle = settings.angle * (Math.PI / 180);
      const x1 = Math.cos(angle) * width;
      const y1 = Math.sin(angle) * height;
      gradient = ctx.createLinearGradient(0, 0, x1, y1);
    } else {
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.max(width, height);
      gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        radius
      );
    }

    // Sort points by distance along gradient line
    const sortedPoints = [...controlPoints].sort((a, b) => {
      const distA = (a.x + a.y) / 2;
      const distB = (b.x + b.y) / 2;
      return distA - distB;
    });

    sortedPoints.forEach((point, index) => {
      const position = index / (sortedPoints.length - 1);
      gradient.addColorStop(position, point.color);
    });

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Apply post-processing effects
    applyPostProcessing(ctx, canvas.width, canvas.height);

    setGradientUrl(canvas.toDataURL("image/jpeg", 0.9));
  }, [controlPoints, settings]);

  // Post-processing effects
  const applyPostProcessing = useCallback(
    (ctx, width, height) => {
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;

      // Brightness
      const brightnessAdjust = (settings.brightness - 100) / 100;
      // Contrast
      const contrastFactor =
        (259 * (settings.contrast + 255)) / (255 * (259 - settings.contrast));
      // Saturation
      const saturationFactor = settings.saturation / 100;

      for (let i = 0; i < data.length; i += 4) {
        // Apply brightness
        data[i] += 255 * brightnessAdjust;
        data[i + 1] += 255 * brightnessAdjust;
        data[i + 2] += 255 * brightnessAdjust;

        // Apply contrast
        data[i] = constrain(contrastFactor * (data[i] - 128) + 128);
        data[i + 1] = constrain(contrastFactor * (data[i + 1] - 128) + 128);
        data[i + 2] = constrain(contrastFactor * (data[i + 2] - 128) + 128);

        // Apply saturation
        const gray = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = constrain(gray + (data[i] - gray) * saturationFactor);
        data[i + 1] = constrain(gray + (data[i + 1] - gray) * saturationFactor);
        data[i + 2] = constrain(gray + (data[i + 2] - gray) * saturationFactor);
      }

      // Apply noise
      if (settings.noise > 0) {
        for (let i = 0; i < data.length; i += 4) {
          const noise = (Math.random() - 0.5) * settings.noise;
          data[i] = constrain(data[i] + noise);
          data[i + 1] = constrain(data[i + 1] + noise);
          data[i + 2] = constrain(data[i + 2] + noise);
        }
      }

      ctx.putImageData(imageData, 0, 0);

      // Apply blur
      if (settings.blur > 0) {
        ctx.filter = `blur(${settings.blur}px)`;
        ctx.drawImage(ctx.canvas, 0, 0);
        ctx.filter = "none";
      }
    },
    [settings]
  );

  const constrain = (value) => Math.max(0, Math.min(255, value));

  // Preset management
  const savePreset = useCallback(() => {
    const newPreset = {
      id: Date.now(),
      name: `Preset ${presets.length + 1}`,
      controlPoints: [...controlPoints],
      settings: { ...settings },
    };
    setPresets((prev) => [...prev, newPreset]);
  }, [controlPoints, settings]);

  const loadPreset = useCallback(
    (presetId) => {
      const preset = presets.find((p) => p.id === presetId);
      if (preset) {
        setControlPoints(preset.controlPoints);
        setSettings(preset.settings);
        setActivePreset(presetId);
        generateGradient();
      }
    },
    [presets, generateGradient]
  );

  // Export options
  const handleExport = useCallback(
    (format) => {
      const link = document.createElement("a");

      if (format === "jpg") {
        link.href = gradientUrl;
        link.download = "gradient.jpg";
      } else if (format === "svg") {
        // Generate SVG version of the gradient
        const svg = generateSVGGradient();
        const blob = new Blob([svg], { type: "image/svg+xml" });
        link.href = URL.createObjectURL(blob);
        link.download = "gradient.svg";
      } else if (format === "css") {
        // Generate CSS code
        const css = generateCSS();
        const blob = new Blob([css], { type: "text/css" });
        link.href = URL.createObjectURL(blob);
        link.download = "gradient.css";
      }

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    [gradientUrl, controlPoints, settings]
  );

  const generateSVGGradient = useCallback(() => {
    const [width, height] = settings.resolution.split("x");
    return `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <${settings.gradientType}Gradient id="gradient" ${
      settings.gradientType === "linear"
        ? `gradientTransform="rotate(${settings.angle})"`
        : ""
    }>
            ${controlPoints
              .map(
                (point, index) => `
              <stop offset="${
                (index / (controlPoints.length - 1)) * 100
              }%" style="stop-color:${point.color};stop-opacity:${
                  point.opacity / 100
                }"/>
            `
              )
              .join("")}
          </${settings.gradientType}Gradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#gradient)"/>
      </svg>
    `;
  }, [controlPoints, settings]);

  const generateCSS = useCallback(() => {
    const sortedPoints = [...controlPoints].sort((a, b) => {
      const distA = (a.x + a.y) / 2;
      const distB = (b.x + b.y) / 2;
      return distA - distB;
    });

    return `
      .gradient {
        background: ${settings.gradientType}-gradient(
          ${
            settings.gradientType === "linear"
              ? `${settings.angle}deg`
              : "circle"
          },
          ${sortedPoints
            .map(
              (point, index) =>
                `${point.color} ${(index / (sortedPoints.length - 1)) * 100}%`
            )
            .join(", ")}
        );
      }
    `;
  }, [controlPoints, settings]);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Advanced Gradient Generator</span>
            <div className="space-x-2">
              <Button
                variant="outline"
                onClick={undo}
                disabled={historyIndex <= 0}
              >
                <Undo className="w-4 h-4 mr-1" /> Undo
              </Button>
              <Button
                variant="outline"
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
              >
                <Redo className="w-4 h-4 mr-1" /> Redo
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-12 gap-6">
            {/* Main workspace */}
            <div className="col-span-8 space-y-4">
              {/* Image upload area */}
              {!previewUrl ? (
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <Upload className="mx-auto w-12 h-12 text-gray-400 mb-4" />
                  <input type="file" className="hidden" accept="image/*" />
                  <p className="text-sm text-gray-500">
                    Upload an image to start or drag and drop
                  </p>
                </div>
              ) : (
                <div className="relative">
                  <canvas
                    ref={canvasRef}
                    className="w-full rounded-lg"
                    onClick={handleCanvasClick}
                  />
                  {/* Control points */}
                  {controlPoints.map((point) => (
                    <div
                      key={point.id}
                      className="absolute w-4 h-4 rounded-full cursor-move"
                      style={{
                        left: `${point.x}%`,
                        top: `${point.y}%`,
                        backgroundColor: point.color,
                        transform: "translate(-50%, -50%)",
                        border:
                          selectedPoint === point.id
                            ? "2px solid white"
                            : "2px solid rgba(255,255,255,0.5)",
                        boxShadow: "0 0 4px rgba(0,0,0,0.5)",
                      }}
                      onClick={() => setSelectedPoint(point.id)}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData("pointId", point.id.toString());
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Preview and Export */}
              {gradientUrl && (
                <div className="space-y-4">
                  <img
                    src={gradientUrl}
                    alt="Generated gradient"
                    className="w-full rounded-lg"
                  />
                  <div className="flex justify-between items-center">
                    <Button onClick={() => handleExport("jpg")}>
                      <Download className="w-4 h-4 mr-2" /> Export as JPG
                    </Button>
                    <Button onClick={() => handleExport("svg")}>
                      <Download className="w-4 h-4 mr-2" /> Export as SVG
                    </Button>
                    <Button onClick={() => handleExport("css")}>
                      <Download className="w-4 h-4 mr-2" /> Export as CSS
                    </Button>
                    <Button onClick={savePreset}>
                      <Save className="w-4 h-4 mr-2" /> Save as Preset
                    </Button>
                    <Button>
                      <Share2 className="w-4 h-4 mr-2" /> Share
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Control Panel */}
            <div className="col-span-4">
              <Tabs defaultValue="controls" className="w-full">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="controls">Controls</TabsTrigger>
                  <TabsTrigger value="points">Points</TabsTrigger>
                  <TabsTrigger value="presets">Presets</TabsTrigger>
                </TabsList>

                <TabsContent value="controls" className="space-y-4">
                  {/* Gradient Type */}
                  <div className="space-y-2">
                    <Label>Gradient Type</Label>
                    <Select
                      value={settings.gradientType}
                      onValueChange={(value) =>
                        setSettings((prev) => ({
                          ...prev,
                          gradientType: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="linear">Linear</SelectItem>
                        <SelectItem value="radial">Radial</SelectItem>
                        <SelectItem value="conic">Conic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Angle (for linear gradients) */}
                  {settings.gradientType === "linear" && (
                    <div className="space-y-2">
                      <Label>Angle: {settings.angle}°</Label>
                      <Slider
                        value={[settings.angle]}
                        min={0}
                        max={360}
                        step={1}
                        onValueChange={([value]) =>
                          setSettings((prev) => ({
                            ...prev,
                            angle: value,
                          }))
                        }
                      />
                    </div>
                  )}

                  {/* Image Adjustments */}
                  <div className="space-y-4">
                    <Label>Adjustments</Label>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Brightness</span>
                        <span>{settings.brightness}%</span>
                      </div>
                      <Slider
                        value={[settings.brightness]}
                        min={0}
                        max={200}
                        step={1}
                        onValueChange={([value]) =>
                          setSettings((prev) => ({
                            ...prev,
                            brightness: value,
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Contrast</span>
                        <span>{settings.contrast}%</span>
                      </div>
                      <Slider
                        value={[settings.contrast]}
                        min={0}
                        max={200}
                        step={1}
                        onValueChange={([value]) =>
                          setSettings((prev) => ({
                            ...prev,
                            contrast: value,
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Saturation</span>
                        <span>{settings.saturation}%</span>
                      </div>
                      <Slider
                        value={[settings.saturation]}
                        min={0}
                        max={200}
                        step={1}
                        onValueChange={([value]) =>
                          setSettings((prev) => ({
                            ...prev,
                            saturation: value,
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Blur</span>
                        <span>{settings.blur}px</span>
                      </div>
                      <Slider
                        value={[settings.blur]}
                        min={0}
                        max={20}
                        step={0.5}
                        onValueChange={([value]) =>
                          setSettings((prev) => ({
                            ...prev,
                            blur: value,
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Noise</span>
                        <span>{settings.noise}</span>
                      </div>
                      <Slider
                        value={[settings.noise]}
                        min={0}
                        max={50}
                        step={1}
                        onValueChange={([value]) =>
                          setSettings((prev) => ({
                            ...prev,
                            noise: value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  {/* Resolution */}
                  <div className="space-y-2">
                    <Label>Resolution</Label>
                    <Select
                      value={settings.resolution}
                      onValueChange={(value) =>
                        setSettings((prev) => ({
                          ...prev,
                          resolution: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1920x1080">
                          1920x1080 (FHD)
                        </SelectItem>
                        <SelectItem value="2560x1440">
                          2560x1440 (QHD)
                        </SelectItem>
                        <SelectItem value="3840x2160">
                          3840x2160 (4K)
                        </SelectItem>
                        <SelectItem value="custom">Custom...</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Settings */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Auto Update</Label>
                      <Switch
                        checked={settings.autoUpdate}
                        onCheckedChange={(checked) =>
                          setSettings((prev) => ({
                            ...prev,
                            autoUpdate: checked,
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Snap to Edges</Label>
                      <Switch
                        checked={settings.snapToEdges}
                        onCheckedChange={(checked) =>
                          setSettings((prev) => ({
                            ...prev,
                            snapToEdges: checked,
                          }))
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Show Grid</Label>
                      <Switch
                        checked={settings.showGrid}
                        onCheckedChange={(checked) =>
                          setSettings((prev) => ({
                            ...prev,
                            showGrid: checked,
                          }))
                        }
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="points" className="space-y-4">
                  {selectedPoint && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Color</Label>
                        <input
                          type="color"
                          value={
                            controlPoints.find((p) => p.id === selectedPoint)
                              ?.color || "#000000"
                          }
                          onChange={(e) => {
                            setControlPoints((prev) =>
                              prev.map((point) =>
                                point.id === selectedPoint
                                  ? { ...point, color: e.target.value }
                                  : point
                              )
                            );
                          }}
                          className="w-full h-10 rounded-md"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>
                          Opacity:{" "}
                          {
                            controlPoints.find((p) => p.id === selectedPoint)
                              ?.opacity
                          }
                          %
                        </Label>
                        <Slider
                          value={[
                            controlPoints.find((p) => p.id === selectedPoint)
                              ?.opacity || 100,
                          ]}
                          min={0}
                          max={100}
                          step={1}
                          onValueChange={([value]) => {
                            setControlPoints((prev) =>
                              prev.map((point) =>
                                point.id === selectedPoint
                                  ? { ...point, opacity: value }
                                  : point
                              )
                            );
                          }}
                        />
                      </div>

                      <Button
                        variant="destructive"
                        onClick={() => {
                          setControlPoints((prev) =>
                            prev.filter((point) => point.id !== selectedPoint)
                          );
                          setSelectedPoint(null);
                        }}
                      >
                        Delete Point
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="presets" className="space-y-4">
                  {presets.map((preset) => (
                    <div
                      key={preset.id}
                      className="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 cursor-pointer"
                      onClick={() => loadPreset(preset.id)}
                    >
                      <span>{preset.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPresets((prev) =>
                            prev.filter((p) => p.id !== preset.id)
                          );
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedGradientGenerator;
