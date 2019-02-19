import Reader = Deno.Reader;
import ReadResult = Deno.ReadResult;

export class MultiReader {
  private readers: Array<Reader>;
  constructor(...readers: Array<Reader>) {
    this.readers = [...readers];
  }

  async read(p: Uint8Array): Promise<ReadResult> {
    while (this.readers.length > 0) {
      // Optimization to flatten nested multiReaders
      if (this.readers.length === 1) {
        if (this.readers[0] instanceof MultiReader) {
          const nestedMultiReader = this.readers[0] as MultiReader;
          this.readers = nestedMultiReader.readers;
        }
      }
      let { nread, eof } = await this.readers[0].read(p);
      if (eof) {
        this.readers.shift();
      }
      if (nread > 0 || !eof) {
        if (eof && this.readers.length > 0) {
          // Don't return eof yet. More readers remain.
          eof = false;
        }
        return {
          nread,
          eof,
        };
      }
    }
    return {
      nread: 0,
      eof: true,
    };
  }
}
