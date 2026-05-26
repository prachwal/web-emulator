package video

// Framebuffer holds indexed color data for a video frame.
type Framebuffer struct {
	Width  int
	Height int
	Data   []byte
}

// NewFramebuffer creates a new framebuffer with the given dimensions.
func NewFramebuffer(width, height int) *Framebuffer {
	return &Framebuffer{
		Width:  width,
		Height: height,
		Data:   make([]byte, width*height),
	}
}

// SetPixel sets a pixel at (x, y) to the given color index.
func (fb *Framebuffer) SetPixel(x, y int, colorIndex byte) {
	if x < 0 || x >= fb.Width || y < 0 || y >= fb.Height {
		return
	}
	fb.Data[y*fb.Width+x] = colorIndex
}

// GetPixel returns the color index at (x, y).
func (fb *Framebuffer) GetPixel(x, y int) byte {
	if x < 0 || x >= fb.Width || y < 0 || y >= fb.Height {
		return 0
	}
	return fb.Data[y*fb.Width+x]
}

// Clear fills the framebuffer with the given color index.
func (fb *Framebuffer) Clear(colorIndex byte) {
	for i := range fb.Data {
		fb.Data[i] = colorIndex
	}
}
