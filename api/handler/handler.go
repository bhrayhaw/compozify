package handler

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/profclems/compozify/pkg/parser"
)

type DockerCommand struct {
	Command string `json:"command"`
}

type Response struct {
	Output string `json:"output"`
}

func ParseDockerCommand(w http.ResponseWriter, r *http.Request) {
	var dockerCmd DockerCommand
	err := json.NewDecoder(r.Body).Decode(&dockerCmd)

	if err != nil {
		http.Error(w, fmt.Sprintf("Error decoding request body: %v", err), http.StatusBadRequest)
		return
	}

	// Validate the command.
	if dockerCmd.Command == "" {
		http.Error(w, "Docker command cannot be empty", http.StatusBadRequest)
		return
	}

	// Create a new Parser
	p, err := parser.New(dockerCmd.Command)
	if err != nil {
		http.Error(w, fmt.Sprintf("Error creating parser: %v", err), http.StatusBadRequest)
		return
	}

	// Parse the Docker command
	err = p.Parse()
	if err != nil {
		http.Error(w, fmt.Sprintf("Error parsing command: %v", err), http.StatusBadRequest)
		return
	}

	dockerComposeYaml := p.String()

	// Create the response
	resp := Response{
		Output: dockerComposeYaml,
	}

	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(resp)
	if err != nil {
		log.Printf("Unable to write response: %v", err)
		return
	}
}
