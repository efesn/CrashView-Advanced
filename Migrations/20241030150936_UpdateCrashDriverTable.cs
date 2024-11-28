using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CrashViewAdvanced.Migrations
{
    /// <inheritdoc />
    public partial class UpdateCrashDriverTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CrashDrivers_Crashes_CrashId",
                table: "CrashDrivers");

            migrationBuilder.DropForeignKey(
                name: "FK_CrashDrivers_Crashes_CrashId1",
                table: "CrashDrivers");

            migrationBuilder.DropForeignKey(
                name: "FK_CrashDrivers_Drivers_DriverId",
                table: "CrashDrivers");

            migrationBuilder.DropPrimaryKey(
                name: "PK_CrashDrivers",
                table: "CrashDrivers");

            migrationBuilder.RenameTable(
                name: "CrashDrivers",
                newName: "CrashDriver");

            migrationBuilder.RenameIndex(
                name: "IX_CrashDrivers_DriverId",
                table: "CrashDriver",
                newName: "IX_CrashDriver_DriverId");

            migrationBuilder.RenameIndex(
                name: "IX_CrashDrivers_CrashId1",
                table: "CrashDriver",
                newName: "IX_CrashDriver_CrashId1");

            migrationBuilder.RenameIndex(
                name: "IX_CrashDrivers_CrashId",
                table: "CrashDriver",
                newName: "IX_CrashDriver_CrashId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_CrashDriver",
                table: "CrashDriver",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_CrashDriver_Crashes_CrashId",
                table: "CrashDriver",
                column: "CrashId",
                principalTable: "Crashes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_CrashDriver_Crashes_CrashId1",
                table: "CrashDriver",
                column: "CrashId1",
                principalTable: "Crashes",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_CrashDriver_Drivers_DriverId",
                table: "CrashDriver",
                column: "DriverId",
                principalTable: "Drivers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CrashDriver_Crashes_CrashId",
                table: "CrashDriver");

            migrationBuilder.DropForeignKey(
                name: "FK_CrashDriver_Crashes_CrashId1",
                table: "CrashDriver");

            migrationBuilder.DropForeignKey(
                name: "FK_CrashDriver_Drivers_DriverId",
                table: "CrashDriver");

            migrationBuilder.DropPrimaryKey(
                name: "PK_CrashDriver",
                table: "CrashDriver");

            migrationBuilder.RenameTable(
                name: "CrashDriver",
                newName: "CrashDrivers");

            migrationBuilder.RenameIndex(
                name: "IX_CrashDriver_DriverId",
                table: "CrashDrivers",
                newName: "IX_CrashDrivers_DriverId");

            migrationBuilder.RenameIndex(
                name: "IX_CrashDriver_CrashId1",
                table: "CrashDrivers",
                newName: "IX_CrashDrivers_CrashId1");

            migrationBuilder.RenameIndex(
                name: "IX_CrashDriver_CrashId",
                table: "CrashDrivers",
                newName: "IX_CrashDrivers_CrashId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_CrashDrivers",
                table: "CrashDrivers",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_CrashDrivers_Crashes_CrashId",
                table: "CrashDrivers",
                column: "CrashId",
                principalTable: "Crashes",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_CrashDrivers_Crashes_CrashId1",
                table: "CrashDrivers",
                column: "CrashId1",
                principalTable: "Crashes",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_CrashDrivers_Drivers_DriverId",
                table: "CrashDrivers",
                column: "DriverId",
                principalTable: "Drivers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
