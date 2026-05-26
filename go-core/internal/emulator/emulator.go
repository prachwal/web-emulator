package emulator

import "crt-webapp/go-core/internal/video"

// EmulatorCore provides the minimal emulation logic.
type EmulatorCore struct {
	Framebuffer *video.Framebuffer
	FrameCount  int
}

// NewEmulatorCore creates a new emulator core.
func NewEmulatorCore(width, height int) *EmulatorCore {
	return &EmulatorCore{
		Framebuffer: video.NewFramebuffer(width, height),
		FrameCount:  0,
	}
}

// StepFrame advances the emulation by one frame.
// In a real implementation this would decode CPU/memory state.
func (ec *EmulatorCore) StepFrame() {
	// Placeholder: fill with test pattern
	fb := ec.Framebuffer
	for y := 0; y < fb.Height; y++ {
		for x := 0; x < fb.Width; x++ {
			fb.SetPixel(x, y, byte((x+y+ec.FrameCount)%16))
		}
	}
	ec.FrameCount++
}
