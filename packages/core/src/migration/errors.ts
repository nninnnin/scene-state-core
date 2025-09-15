export class MigrationError extends Error {
  name = "MigrationError";
}

export class NoMigrationPathError extends MigrationError {
  readonly from: number;
  readonly to: number;

  constructor(
    from: number,
    to: number,
  ) {
    super(
      `No migration path: ${from} -> ${to}`,
    );

    this.name = "NoMigrationPathError";
    this.from = from;
    this.to = to;
  }
}
