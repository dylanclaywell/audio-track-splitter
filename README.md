# audio-track-splitter

This project provides a user interface for splitting a single audio file into multiple tracks. The client is powered by Vue and the server is powered by Node and Express.

## Requirements

- Node v16
- ffmpeg

## Getting started

There are two parts of this project - a client and server. The server can be used without the client by using a tool such as cURL or Postman.

### Server

The following commands should be run in `audio-track-splitter/server`.

Install dependencies:

```bash
yarn
# or
yarn install
```

Start server:

```bash
yarn start
```

The server starts at `http://localhost:4000`.

#### Endpoints

The server exposes the POST endpoint `/splitIntoTracks` and expects the following arguments in JSON format:

```jsonc
{
  // The sourceFile should be put in server/sources
  "sourceFile": "source.flac",
  // The fileFormat should be the file extension to use
  // for the split tracks that are created. Do not include the `.`
  "fileFormat": "flac",
  // tracks is an array of track objects
  "tracks": [
    {
      // name is used as both the metadata tag for the
      // track as well as the file name. Do not include
      // the file extension; it will be added using the fileFormat
      // field
      "name": "Track Name",
      // startTime should be formatted as HH:MM:SS
      "startTime": "00:00:00",
      // endTime should be formatted as HH:MM:SS
      "endTime": "00:02:03"
    }
  ]
}
```

### Client

The following commands should be run in `audio-track-splitter/client`.

Install dependencies:

```bash
yarn
# or
yarn install
```

Start client:

```bash
yarn start
```

The client starts at `http://localhost:3000`.

The client is just used to provide a handy interface for the server. It validates input and sends a POST request to `/splitIntoTracks`.
