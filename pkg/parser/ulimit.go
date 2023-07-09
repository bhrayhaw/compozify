package parser

import (
	"gopkg.in/yaml.v3"
	"strconv"
	"strings"
)

type Ulimit struct {
	Name     string // name in docker-compose
	Soft     int
	Hard     int
	NodeType FlagType
}

type Ulimits []*Ulimit

// ParseUlimit converts docker run ulimit format to docker-compose ulimit format
// into the Ulimit struct
func ParseUlimit(s string) (*Ulimit, error) {
	ulimit := &Ulimit{}
	ulimit.NodeType = MapType

	if s == "" {
		return nil, errInvalidFlag
	}

	ulimitSplit := strings.Split(s, "=")
	if len(ulimitSplit) != 2 {
		return nil, errInvalidFlag
	}

	ulimit.Name = ulimitSplit[0]

	// ulimit value format: soft:hard eg: --ulimit nofile=1024:2048
	// TODO: support soft only, eg: --ulimit nofile=1024
	ulimitValueSplit := strings.Split(ulimitSplit[1], ":")
	if len(ulimitValueSplit) != 2 {
		return nil, errInvalidFlag
	}

	soft, err := strconv.Atoi(ulimitValueSplit[0])
	if err != nil {
		return nil, errInvalidFlag
	}

	hard, err := strconv.Atoi(ulimitValueSplit[1])
	if err != nil {
		return nil, errInvalidFlag
	}

	ulimit.Soft = soft
	ulimit.Hard = hard

	return ulimit, nil
}

// YAML converts the Ulimit struct to a yaml.Node
func (u *Ulimit) YAML() (key, value *yaml.Node) {
	value = &yaml.Node{
		Kind: yaml.MappingNode,
		Content: []*yaml.Node{
			{
				Kind:  yaml.ScalarNode,
				Value: "soft",
			},
			{
				Kind:  yaml.ScalarNode,
				Value: strconv.Itoa(u.Soft),
			},
			{
				Kind:  yaml.ScalarNode,
				Value: "hard",
			},
			{
				Kind:  yaml.ScalarNode,
				Value: strconv.Itoa(u.Hard),
			},
		},
	}

	key = &yaml.Node{
		Kind:  yaml.ScalarNode,
		Value: u.Name,
	}

	return key, value
}

// YAMLString converts the Ulimit struct to a yaml.Node and returns the string
func (u *Ulimit) YAMLString() (string, error) {
	key, value := u.YAML()
	document := &yaml.Node{
		Kind: yaml.DocumentNode,
		Content: []*yaml.Node{
			{
				Kind: yaml.MappingNode,
				Content: []*yaml.Node{
					key,
					value,
				},
			},
		},
	}
	b, err := yaml.Marshal(document)
	if err != nil {
		return "", err
	}
	return string(b), nil
}

// ParseUlimits converts docker run ulimit format to docker-compose ulimit format
// into the Ulimits struct
func ParseUlimits(s string) (Ulimits, error) {
	ulimits := Ulimits{}

	if s == "" {
		return nil, errInvalidFlag
	}

	ulimitSplit := strings.Split(s, ",")
	for _, ulimit := range ulimitSplit {
		ulimit, err := ParseUlimit(ulimit)
		if err != nil {
			return nil, err
		}

		ulimits = append(ulimits, ulimit)
	}

	return ulimits, nil
}
